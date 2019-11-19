import {Injectable}      from '@nestjs/common';
import {AccountClient}   from "../lib/microservice/account/account.client";
import {Socket}          from "socket.io";
import {User}            from "./user";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class ShardService {

    private _users$ = new BehaviorSubject<User[]>([]);
    users$          = this._users$.asObservable();

    get users() {
        return this._users$.getValue();
    }

    constructor(private account: AccountClient) {
    }

    async getUserFor(socket: Socket) {
        let account: { id: number, email: string } = await this.account.getAccountByToken(socket.handshake.query.token);
        let user                                   = new User(
            account.id,
            account.email,
            socket
        );
        this._users$.next([...this._users$.getValue(), user]);
    }

}

