import {Injectable}            from '@nestjs/common';
import {AccountClient}         from "../../microservice/account/client/account.client";
import {Socket}                from "socket.io";
import {User}                  from "./user";
import {BehaviorSubject, from} from "rxjs";
import {filter, map, toArray}  from "rxjs/operators";
import {Repository}            from "typeorm";
import {Character}             from "../../microservice/character/entities/character";
import {InjectRepository}      from "@nestjs/typeorm";
import {CharacterClient}       from "../../microservice/character/client/character.client";

@Injectable()
export class WorldService {

    private _users$ = new BehaviorSubject<User[]>([]);
    users$          = this._users$.asObservable();

    get users() {
        return this._users$.getValue();
    }

    constructor(
        private account: AccountClient,
        private character: CharacterClient
    ) {
    }

    async verifyUser(socket: Socket) {
        try {
            let account: { id: number, email: string } = await this.account.getAccount(socket.handshake.query.token, true);
            return account;
        } catch (e) {
            throw new Error("Session Expired");
        }
    }

    async getUser(socket: Socket): Promise<{ id: number, email: string }> {
        return await this.account.getAccount(socket.handshake.query.token, true);
    }

    async getCharacters(socket: Socket) {
        let account = await this.getUser(socket);
        if (account) {
            return await this.character.getAll(account.id);
        }
        return [];
    }

    async createCharacter(socket: Socket, name: string, gender: 'male' | 'female') {
        let account = await this.getUser(socket);
        if (account) {
            return await this.character.create(account.id, name, gender);
        }
        return null;
    }
}

