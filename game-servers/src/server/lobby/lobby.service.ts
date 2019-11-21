import {Injectable, UnauthorizedException} from '@nestjs/common';
import {Socket}                            from "socket.io";
import {AccountClient}                     from "../../microservice/account/client/account.client";

@Injectable()
export class LobbyService {

    accountsBySocketId: { [socketId: string]: number }  = {};
    socketsByAccountId: { [accountId: number]: Socket } = {};

    constructor(private account: AccountClient) {

    }

    async getAccount(client: Socket) {
        let account = await this.account.getAccount(client.handshake.query.token, true);
        if (!account) {
            throw new UnauthorizedException();
        }
        return account;
    }
}
