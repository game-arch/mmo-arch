import { Injectable }       from "@nestjs/common";
import { AccountClient }    from "../account/client/account.client";
import { Socket }           from "socket.io";
import { CharacterClient }  from "../character/client/character.client";
import { WorldConstants }   from "../../lib/constants/world.constants";
import { MapClient }        from "../map/client/map.client";
import { Repository }       from "typeorm";
import { Player }           from "./entities/player";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class WorldService {

    constructor(
        @InjectRepository(Player)
        private players: Repository<Player>,
        private account: AccountClient,
        private character: CharacterClient,
        private map: MapClient
    ) {
    }

    async storeUser(client: Socket, accountId: number) {
        let player       = this.players.create();
        player.accountId = accountId;
        player.socketId  = client.id;
        await this.players.save(player);
    }

    async removePlayer(client: Socket) {
        await this.removeCharacter(client);
        await this.players.delete({ socketId: client.id });
    }

    async storeCharacter(client: Socket, character: { id: number, name: string }) {
        let player = await this.players.findOne({ socketId: client.id });
        if (player) {
            await this.validateCharacterLogin(player, character.id);
            await this.character.characterOnline(character.id, client.id);
            player.characterId   = character.id;
            player.characterName = character.name;
            await this.players.save(player);
            client.adapter.add(client.id, "character-id." + character.id);
            client.adapter.add(client.id, "character-name." + character.name);
        }
    }

    async validateCharacterLogin(player: Player, characterId: number) {
        let verified = await this.character.getCharacter(characterId);
        if (verified.accountId !== player.accountId) {
            throw new Error("Character's Account ID does not match");
        }
        if (verified.world !== WorldConstants.CONSTANT) {
            throw new Error("Character is on a different world");
        }
        // if (verified.status !== "offline") {
        //     throw new Error("Character is already online");
        // }
    }

    async removeCharacter(client: Socket) {
        let player = await this.players.findOne({ socketId: client.id });
        if (player) {
            await this.character.characterOffline(player.characterId);
            client.adapter.del(client.id, "character-id." + player.characterId);
            client.adapter.del(client.id, "character-name." + player.characterName);
            player.characterId   = null;
            player.characterName = null;
            await this.players.save(player);
        }
    }

    async authenticate(socket: Socket) {
        try {
            let account: { id: number, email: string } = await this.account.getAccount(socket.handshake.query.token, true);
            return account;
        } catch (e) {
            throw new Error("Session Expired");
        }
    }

    async getCharacters(accountId: number) {
        return await this.character.getAll(accountId, WorldConstants.CONSTANT);
    }

    async createCharacter(accountId: number, name: string, gender: "male" | "female") {
        return await this.character.create(accountId, WorldConstants.CONSTANT, name, gender);
    }

    async playerDirectionalInput(client: Socket, data: { directions: { up: boolean, down: boolean, left: boolean, right: boolean } }) {
        let player = await this.players.findOne({ socketId: client.id });
        if (player && player.characterId !== null) {
            let map = this.getMapOf(client);
            this.map.playerDirectionalInput(player.characterId, WorldConstants.CONSTANT, map, data.directions);
        }
    }

    getMapOf(client: Socket) {
        let mapRoom = Object.keys(client.rooms).filter(name => name.indexOf("map.") === 0)[0] || "";
        return mapRoom.substr(4, mapRoom.length);
    }
}

