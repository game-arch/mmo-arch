import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
}                        from "@nestjs/websockets";
import {Server, Socket}  from "socket.io";
import {RegisterService} from "./register.service";

@WebSocketGateway()
export class RegisterGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private service: RegisterService) {

    }

    handleConnection(client: Socket, ...args: any[]): any {
        this.service.register(client.id, client.handshake.address);
    }

    @SubscribeMessage('update')
    onUpdate(client: Socket, {current, capacity}: { current: number, capacity: number }) {
        if (this.service.has(client.id)) {
            this.service.set(client.id, capacity, current);
        }
    }

    handleDisconnect(client: Socket): any {
        this.service.unregister(client.id);
    }


}
