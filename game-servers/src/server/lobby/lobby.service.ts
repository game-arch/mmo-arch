import {Injectable, UnauthorizedException} from '@nestjs/common';
import {Socket}                            from "socket.io";
import {AccountClient}                     from "../../microservice/account/client/account.client";
import {PresenceClient}                    from "../../microservice/presence/client/presence.client";

@Injectable()
export class LobbyService {

    accountsBySocketId: { [socketId: string]: number }  = {};
    socketsByAccountId: { [accountId: number]: Socket } = {};

    constructor(
        private account: AccountClient,
        private presence: PresenceClient
    ) {

    }

    async getAccount(client: Socket) {
        let account = await this.account.getAccount(client.handshake.query.token, true);
        if (!account) {
            throw new UnauthorizedException();
        }
        return account;
    }

    async getServers() {
        return await this.presence.getServers();
    }
}
