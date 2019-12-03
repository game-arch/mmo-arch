import {Injectable}      from '@nestjs/common';
import {AccountClient}   from "../account/client/account.client";
import {Socket}          from "socket.io";
import {CharacterClient} from "../character/client/character.client";
import {WorldConstants}  from "../../lib/constants/world.constants";
import {MapClient}       from "../map/client/map.client";
import {RedisSocket}     from "./redis.socket";

export class Player {

    constructor(public accountId: number, public socket: Socket, public character?: { id: number, name: string }) {

    }
}

@Injectable()
export class WorldService {


    accounts: { [accountId: number]: Player }     = {};
    sockets: { [socketId: string]: Player }       = {};
    characters: { [characterId: number]: Player } = {};

    constructor(
        private account: AccountClient,
        private character: CharacterClient,
        private map: MapClient
    ) {
    }

    storeUser(client: RedisSocket, accountId: number) {
        this.accounts[accountId] = new Player(accountId, client);
        this.sockets[client.id]  = this.accounts[accountId];
    }

    async removePlayer(client: RedisSocket) {
        if (this.sockets[client.id]) {
            let player = this.sockets[client.id];
            await this.removeCharacter(client);
            delete this.accounts[player.accountId];
            delete this.sockets[client.id];
        }
    }

    async storeCharacter(client: RedisSocket, character: { id: number, name: string }) {
        let player = this.sockets[client.id];
        await this.validateCharacterLogin(client, character.id);
        this.character.characterOnline(character.id, client.id);
        player.character              = character;
        this.characters[character.id] = player;
        client.adapter.add(client.id, 'character-id.' + character.id);
        client.adapter.add(client.id, 'character-name.' + character.name);
    }

    async validateCharacterLogin(client: RedisSocket, characterId: number) {
        let verified = await this.character.getCharacter(characterId);
        if (verified.accountId !== this.sockets[client.id].accountId) {
            throw new Error("Character's Account ID does not match");
        }
        if (verified.world !== WorldConstants.CONSTANT) {
            throw new Error("Character is on a different world");
        }
        if (verified.status !== 'offline') {
            throw new Error('Character is already online');
        }
    }

    async removeCharacter(client: RedisSocket) {
        let player = this.sockets[client.id];
        if (player && player.character) {
            let previousCharacter = player.character;
            this.character.characterOffline(previousCharacter.id);
            player.character = null;
            delete this.characters[previousCharacter.id];
            client.adapter.del(client.id, 'character-id.' + previousCharacter.id);
            client.adapter.del(client.id, 'character-name.' + previousCharacter.name);
        }
    }

    async authenticate(socket: RedisSocket) {
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

    async createCharacter(accountId: number, name: string, gender: 'male' | 'female') {
        return await this.character.create(accountId, WorldConstants.CONSTANT, name, gender);
    }

    playerDirectionalInput(client: RedisSocket, data: { directions: { up: boolean, down: boolean, left: boolean, right: boolean } }) {
        let character = this.sockets[client.id].character;
        if (character) {
            let map = this.getMapOf(client);
            this.map.playerDirectionalInput(character.id, WorldConstants.CONSTANT, map, data.directions);
        }
    }

    getMapOf(client: RedisSocket) {
        let mapRoom = Object.keys(client.rooms).filter(name => name.indexOf('map.') === 0)[0] || '';
        return mapRoom.substr(4, mapRoom.length);
    }
}

