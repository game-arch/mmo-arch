import {WebsocketService}                                     from "../../lib/websocket-service";
import {Server, Socket}                                       from "socket.io";
import {WorldService}                                         from "./world.service";
import {ConflictException}                                    from "@nestjs/common";
import {CharacterCreated, CharacterNotCreated, GetCharacters} from "../../global/character/actions";
import {Character}                                            from "../../global/character/entities/character";

export class WorldWebsocketService extends WebsocketService {
    constructor(server: Server, client: Socket, private service: WorldService) {
        super(server, client);
    }

    async authenticate() {
        try {
            if (Object.keys(this.service.accounts).length >= 100) {
                throw new Error("Server Limit Reached");
            }
            let user = await this.service.verifyUser(this.client);
            if (this.service.accounts[user.id]) {
                throw new ConflictException("User already logged in!");
            }
            this.service.storeUser(this.client, user.id);
            this.client.emit(GetCharacters.event, await this.service.getCharacters(user.id));
        } catch (e) {
            this.client.emit("connect-error", e.message);
            this.client.disconnect(true);
        }
    }

    async createCharacter(data: { name: string, gender: 'male' | 'female' }) {
        try {
            let accountId            = this.service.sockets[this.client.id].accountId;
            let character: Character = await this.service.createCharacter(accountId, data.name, data.gender);
            if (character) {
                this.client.emit(GetCharacters.event, await this.service.getCharacters(accountId));
                this.client.emit(CharacterCreated.event, new CharacterCreated(character.world, character.id));
                return character;
            }
            this.client.emit(CharacterNotCreated.event);
            return null;
        } catch (e) {
            this.client.emit(CharacterNotCreated.event, new CharacterNotCreated(e.response));
            return null;
        }
    }
}
