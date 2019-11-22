import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
}                          from "@nestjs/websockets";
import {Server, Socket}    from "socket.io";
import * as io             from "socket.io-client";
import {config}            from "../../lib/config";
import {WorldService}      from "./world.service";
import {Events}            from "../../../lib/constants/events";
import {CharacterEvents}   from "../../microservice/character/character.events";
import {PresenceClient}    from "../presence/presence.client";
import {ConflictException} from "@nestjs/common";
import {from}              from "rxjs";
import {first}             from "rxjs/operators";
import {WorldPresence}     from "./world.presence";

@WebSocketGateway()
export class WorldGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    capacity = 100;

    name = process.env.WORLD_NAME || 'Maiden';

    instanceId = parseInt(process.env.NODE_APP_INSTANCE);

    accounts: number[] = [];

    constructor(private service: WorldService, private presence: WorldPresence) {

    }

    afterInit(server: Server): any {
        this.presence.socket.on('connect', async () => {
            await this.presence.serverList$.pipe(first()).toPromise();
            from(this.accounts)
                .subscribe(id => {
                    this.presence.socket.emit(Events.USER_CONNECTED, {
                        accountId: id,
                        world    : this.name
                    });
                })
        });
        this.presence.socket.on(Events.CHARACTER_JOINED, name => this.server.emit(Events.CHARACTER_JOINED, name));
        this.presence.socket.on(Events.CHARACTER_LEFT, name => this.server.emit(Events.CHARACTER_LEFT, name));
    }

    async handleConnection(client: Socket, ...args: any[]) {
        try {
            if (this.service.users.length >= this.capacity) {
                throw new Error("User Capacity Reached");
            }
            let user = await this.service.verifyUser(client);
            if (this.accounts.indexOf(user.id) !== -1) {
                throw new ConflictException("User already logged in!");
            }
            this.accounts.push(user.id);
            this.presence.socket.emit(Events.USER_CONNECTED, {
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

    @SubscribeMessage(Events.CHARACTER_JOINED)
    async characterJoined(client: Socket, character: { name: string }) {
        let user = await this.service.getUser(client);
        this.presence.socket.emit(Events.CHARACTER_JOINED, {
            accountId: user.id,
            name     : character.name
        });
        this.presence.socket.once('disconnect', () => client.emit(Events.CHARACTER_LEFT, character.name));
    }

    @SubscribeMessage(Events.CHARACTER_LEFT)
    async characterLeft(client: Socket, character: { name: string }) {
        let user = await this.service.getUser(client);
        this.presence.socket.emit(Events.CHARACTER_LEFT, {
            accountId: user.id,
            name     : character.name
        })

    }

    async handleDisconnect(client: Socket) {
        let user = await this.service.getUser(client);
        if (this.accounts.indexOf(user.id) !== -1) {
            this.accounts.splice(this.accounts.indexOf(user.id), 1);
        }
        this.presence.socket.emit(Events.USER_DISCONNECTED, {
            accountId: user.id,
            world    : this.name
        });
    }
}
