import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
}                        from "@nestjs/websockets";
import {Server, Socket}  from "socket.io";
import * as io           from "socket.io-client";
import {config}          from "../../lib/config";
import {WorldService}    from "./world.service";
import {Events}          from "../../../lib/constants/events";
import {CharacterEvents} from "../../microservice/character/character.events";

@WebSocketGateway()
export class WorldGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer()
    server: Server;
    socket: Socket;

    capacity = 100;

    name = process.env.WORLD_NAME || 'Maiden';

    instanceId = parseInt(process.env.NODE_APP_INSTANCE);

    constructor(private service: WorldService) {

    }

    afterInit(server: Server): any {
        this.socket = io(
            'http://' + config.servers.presence.host
            + ':' + config.servers.presence.port
            + '?name=' + this.name
            + '&instanceId='
            + this.instanceId
            + '&port=' + config.servers.world.port
            + '&capacity=' + this.capacity
        );
    }

    async handleConnection(client: Socket, ...args: any[]) {
        try {
            if (this.service.users.length >= this.capacity) {
                throw new Error("User Capacity Reached");
            }
            let user = await this.service.verifyUser(client);
            this.socket.emit(Events.USER_CONNECTED, {
                accountId: user.id,
                world    : this.name
            });
            client.emit(Events.CHARACTER_LIST, await this.service.getCharacters(client));
        } catch (e) {
            client.emit("connection-error", e.message);
            client.disconnect(true);
        }
    }

    @SubscribeMessage(CharacterEvents.CREATE)
    async createCharacter(client: Socket, data: { name: string, gender: 'male' | 'female' }) {
        try {
            let character = await this.service.createCharacter(client, data.name, data.gender);
            if (character) {
                client.emit(Events.CHARACTER_LIST, await this.service.getCharacters(client));
                client.emit(Events.CHARACTER_CREATED, character);
                return;
            }
            client.emit(Events.CHARACTER_NOT_CREATED);
        } catch (e) {
            client.emit(Events.CHARACTER_NOT_CREATED, e.response);
        }
    }

    async handleDisconnect(client: Socket) {
        let user = await this.service.getUser(client);
        this.socket.emit(Events.USER_DISCONNECTED, {
            accountId: user.id,
            world    : this.name
        });
    }
}
