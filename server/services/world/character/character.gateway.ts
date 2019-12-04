import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
}                                  from "@nestjs/websockets";
import {Namespace, Server, Socket} from "socket.io";
import {WorldService}              from "../world.service";
import {Logger}                    from "@nestjs/common";
import {WorldConstants}            from "../../../lib/constants/world.constants";
import {CharacterClient}           from "../../character/client/character.client";
import {
    CreateCharacter,
    CharacterOffline,
    CharacterOnline, GetCharacters, CharacterCreated, CharacterNotCreated
}                                  from "../../character/actions";
import {Character}                 from "../../character/entities/character";
import {InjectRepository}          from "@nestjs/typeorm";
import {Player}                    from "../entities/player";
import {Repository}                from "typeorm";

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT
})
export class CharacterGateway {
    @WebSocketServer()
    server: Namespace;

    constructor(
        @InjectRepository(Player)
        private players: Repository<Player>,
        private logger: Logger,
        private service: WorldService,
        private character: CharacterClient
    ) {

    }

    async sendCharacters() {
        let players = await this.players.find();
        for (let player of players) {
            await this.character.characterOnline(player.accountId, player.socketId);
        }
    }

    @SubscribeMessage(CreateCharacter.event)
    async createCharacter(client: Socket, data: { name: string, gender: 'male' | 'female' }) {
        try {
            let player = await this.players.findOne({socketId: client.id});
            if (player) {
                let character: Character = await this.service.createCharacter(player.accountId, data.name, data.gender);
                if (character) {
                    client.emit(GetCharacters.event, await this.service.getCharacters(player.accountId));
                    client.emit(CharacterCreated.event, new CharacterCreated(character.world, character.id));
                    return character;
                }
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
            console.log(e);
            return {status: 'error'};
        }
    }

    @SubscribeMessage(CharacterOffline.event)
    async characterLeft(client: Socket) {
        try {
            await this.service.removeCharacter(client);
            return {status: 'success'};
        } catch (e) {
            console.log(e);
            return {status: 'error'};
        }
    }
}
