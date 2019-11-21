import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
}                              from "@nestjs/websockets";
import {Server, Socket}        from "socket.io";
import * as io                 from "socket.io-client";
import {RegisteredWorld}       from "../presence/entities/registered-world";
import {Events}                from "../../../lib/constants/events";
import {config}                from "../../lib/config";
import {AccountClient}         from "../../microservice/account/client/account.client";
import {UnauthorizedException} from "@nestjs/common";

@WebSocketGateway()
export class LobbyGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    socket: Socket;

    servers: RegisteredWorld[] = [];

    accountsBySocketId: { [socketId: string]: number }  = {};
    socketsByAccountId: { [accountId: number]: Socket } = {};


    constructor(private account: AccountClient) {

    }

    async handleConnection(client: Socket, ...args: any[]) {
        try {
            let account                         = await this.account.getAccount(client.handshake.query.token, true);
            if (!account) {
                throw new UnauthorizedException();
            }
            this.accountsBySocketId[client.id]  = account.id;
            this.socketsByAccountId[account.id] = client;
            client.emit(Events.SERVER_LIST, this.servers);
        } catch (e) {
            client.emit('connect-error', 'Not Authorized');
            client.disconnect(true);
        }
    }

    handleDisconnect(client: Socket) {
        delete this.socketsByAccountId[this.accountsBySocketId[client.id]];
        delete this.accountsBySocketId[client.id];
    }


    afterInit(server: Server): any {
        this.socket = io('http://' + config.servers.presence.host + ':' + config.servers.presence.port + '?track=false');
        this.socket.on(Events.USER_CONNECTED, data => {
            this.disableEvents(data);
        });
        this.socket.on(Events.USER_DISCONNECTED, data => {
            this.enableEvents(data);
        });
        this.socket.on(Events.SERVER_LIST, (data) => {
            this.servers = data;
            server.to('enabled').emit(Events.SERVER_LIST, data);
        });
    }

    private disableEvents(data:{accountId:number,world:string}) {
        let socket = this.socketsByAccountId[data.accountId];
        if (socket) {
            socket.leave('enabled');
        }
    }

    private enableEvents(data:{accountId:number,world:string}) {
        let socket = this.socketsByAccountId[data.accountId];
        if (socket) {
            socket.join('enabled');
        }
    }
}
