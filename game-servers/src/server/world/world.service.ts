import {Injectable}      from '@nestjs/common';
import {AccountClient}   from "../../microservice/account/client/account.client";
import {Socket}          from "socket.io";
import {User}            from "./user";
import {BehaviorSubject} from "rxjs";
import {CharacterClient} from "../../microservice/character/client/character.client";

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

    async getCharacters(accountId: number) {
        return await this.character.getAll(accountId);
    }

    async createCharacter(accountId: number, name: string, gender: 'male' | 'female') {
        return await this.character.create(accountId, name, gender);
    }
}

