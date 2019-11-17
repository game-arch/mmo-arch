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
        if (Boolean(client.handshake.query.name)) {
            let name = client.handshake.query.name;
            console.log('Track', name);
            await this.service.online(client.id, client.handshake.address, name);
            client.broadcast.emit('servers', this.service.getAll());
            return;
        }
        client.emit('servers', this.service.getAll());
    }

    @SubscribeMessage('update')
    async onUpdate(client: Socket, {current, capacity}: { current: number, capacity: number }) {
        await this.service.set(client.id, capacity, current);
        this.server.emit('servers', this.service.getAll());
    }

    async handleDisconnect(client: Socket) {
        if (client.handshake.query.track !== 'false') {
            await this.service.offline(client.id);
            this.server.emit('servers', this.service.getAll());
        }
    }

    async onApplicationBootstrap() {
    }


}
