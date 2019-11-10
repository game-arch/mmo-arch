import {OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket}                                                     from "socket.io";

@WebSocketGateway(3000)
export class AccountGateway implements OnGatewayInit {
    @WebSocketServer()
    server:Server;

    @SubscribeMessage('message')
    onMessage(client:Socket, data:any) {

    }

    afterInit(server: Server): any {
        console.log('Initialized');
    }
}
