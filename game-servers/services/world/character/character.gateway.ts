import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
}                        from "@nestjs/websockets";
import {Server, Socket}  from "socket.io";
import {WorldService}    from "../world.service";
import {Logger}          from "@nestjs/common";
import {WorldConstants}  from "../../../config/world.constants";
import {CharacterClient} from "../../character/client/character.client";
import {
    CreateCharacter,
    CharacterOffline,
    CharacterOnline, GetCharacters, CharacterCreated, CharacterNotCreated
}                        from "../../character/actions";
import {from}            from "rxjs";
import {Character}       from "../../character/entities/character";

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
    async createCharacter(client: Socket, data: { name: string, gender: 'male' | 'female' }) {
        try {
            let accountId            = this.service.sockets[client.id].accountId;
            let character: Character = await this.service.createCharacter(accountId, data.name, data.gender);
            if (character) {
                client.emit(GetCharacters.event, await this.service.getCharacters(accountId));
                client.emit(CharacterCreated.event, new CharacterCreated(character.world, character.id));
                return character;
            }
            client.emit(CharacterNotCreated.event);
            return null;
        } catch (e) {
            client.emit(CharacterNotCreated.event, new CharacterNotCreated(e.response));
            return null;
        }
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
