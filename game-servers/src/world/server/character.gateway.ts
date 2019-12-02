import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
}                        from "@nestjs/websockets";
import {Server, Socket}  from "socket.io";
import {WorldService}    from "./world.service";
import {Logger}          from "@nestjs/common";
import {WorldConstants}  from "../constants";
import {CharacterClient} from "../../global/character/client/character.client";
import {
    CreateCharacter,
    CharacterOffline,
    CharacterOnline
}                        from "../../global/character/actions";
import {from}            from "rxjs";
import {WorldWebsocket}  from "./world-websocket";

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT
})
export class CharacterGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        private logger: Logger,
        private service: WorldService,
        private character: CharacterClient
    ) {

    }

    async sendCharacters() {
        await from(Object.keys(this.service.characters))
            .subscribe(id => {
                this.character.characterOnline(parseInt(id));
            });
    }

    @SubscribeMessage(CreateCharacter.event)
    async createCharacter(client: WorldWebsocket, data: { name: string, gender: 'male' | 'female' }) {
        return {
            character: await client.service.createCharacter(data)
        };
    }

    @SubscribeMessage(CharacterOnline.event)
    async characterJoined(client: Socket, character: { id: number, name: string }) {
        try {
            await this.service.storeCharacter(client, character);
            return {status: 'success'};
        } catch (e) {
            this.logger.error(e);
            return {status: 'error'};
        }
    }

    @SubscribeMessage(CharacterOffline.event)
    async characterLeft(client: Socket) {
        try {
            this.service.removeCharacter(client);
            return {status: 'success'};
        } catch (e) {
            this.logger.error(e);
            return {status: 'error'};
        }
    }
}
