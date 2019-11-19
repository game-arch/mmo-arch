import {Injectable}            from '@nestjs/common';
import {AccountClient}         from "../lib/microservice/account/account.client";
import {Socket}                from "socket.io";
import {User}                  from "./user";
import {BehaviorSubject, from} from "rxjs";
import {filter, map, toArray}  from "rxjs/operators";
import {Repository}            from "typeorm";
import {Character}             from "./entities/character";
import {InjectRepository}      from "@nestjs/typeorm";

@Injectable()
export class ShardService {

    private _users$ = new BehaviorSubject<User[]>([]);
    users$          = this._users$.asObservable();

    get users() {
        return this._users$.getValue();
    }

    constructor(
        @InjectRepository(Character)
        private repo: Repository<Character>,
        private account: AccountClient
    ) {
    }

    async verifyUser(socket: Socket) {
        try {
            let account: { id: number, email: string } = await this.account.getAccountByToken(socket.handshake.query.token);
            let user                                   = new User(
                socket.handshake.query.token,
                account.id,
                account.email,
                socket
            );
            this._users$.next([...this._users$.getValue(), user]);
            return user;
        } catch (e) {
            throw new Error("Session Expired");
        }
    }

    async userDisconnected(socket: Socket) {
        this._users$.next(await from(this.users).pipe(filter(user => user.socket.id !== socket.id), toArray()).toPromise());
    }

    getUser(socket:Socket) {
        return this._users$.getValue().filter(user => user.socket.id === socket.id)[0] || null;
    }

    async getCharacters(socket: Socket) {
        let user = this._users$.getValue().filter(user => user.socket.id === socket.id)[0] || null;
        if (user) {
            let characters = await this.repo.find({accountId: user.accountId});
            return await from(characters).pipe(map(({id, gender, name}) => ({id, gender, name})), toArray()).toPromise();
        }
        return [];
    }
}

