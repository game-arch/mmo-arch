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
import {Events}                 from "../../lib/constants/events";
import {config}                 from "../lib/config";

@WebSocketGateway()
export class RegisterGateway implements OnGatewayConnection, OnGatewayDisconnect, OnApplicationBootstrap {
    @WebSocketServer()
    server: Server;

    constructor(private service: RegisterService) {
    }

    async handleConnection(client: Socket, ...args: any[]) {
        if (Boolean(client.handshake.query.name)) {
            let name = client.handshake.query.name;
            let port = client.handshake.query.port || config.servers.shard.port;
            await this.service.online(client.id, this.service.getHost(client.handshake.address), port, name);
            client.broadcast.emit(Events.SERVER_LIST, this.service.getAll());
            return;
        }
        client.emit(Events.SERVER_LIST, this.service.getAll());
    }

    @SubscribeMessage('update')
    async onUpdate(client: Socket, {current, capacity}: { current: number, capacity: number }) {
        await this.service.set(client.id, capacity, current);
        this.server.emit(Events.SERVER_LIST, this.service.getAll());
    }

    async handleDisconnect(client: Socket) {
        if (client.handshake.query.track !== 'false') {
            await this.service.offline(client.id);
            this.server.emit(Events.SERVER_LIST, this.service.getAll());
        }
    }

    async onApplicationBootstrap() {
    }


}
