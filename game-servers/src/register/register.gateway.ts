import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
}                               from "@nestjs/websockets";
import {Server, Socket}         from "socket.io";
import {RegisterService}        from "./register.service";
import {OnApplicationBootstrap} from "@nestjs/common";

@WebSocketGateway()
export class RegisterGateway implements OnGatewayConnection, OnGatewayDisconnect, OnApplicationBootstrap {
    @WebSocketServer()
    server: Server;

    constructor(private service: RegisterService) {
    }

    async handleConnection(client: Socket, ...args: any[]) {
        let name = client.handshake.query.name || 'Server';
        await this.service.register(client.id, client.handshake.address, name);
    }

    @SubscribeMessage('update')
    async onUpdate(client: Socket, {current, capacity}: { current: number, capacity: number }) {
        await this.service.set(client.id, capacity, current);
    }

    async handleDisconnect(client: Socket) {
        await this.service.unregister(client.id);
    }

    async onApplicationBootstrap() {
        await this.service.clear();
    }


}
