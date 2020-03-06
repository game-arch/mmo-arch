import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Socket }                            from "socket.io";
import { AccountClient }                     from "../account/client/account.client";
import { PresenceClient }                    from "../presence/client/presence.client";

@Injectable()
export class LobbyService {

  constructor(
    private account: AccountClient,
    private presence: PresenceClient
  ) {

  }

  async getAccount(client: Socket) {
    let account = await this.account.getAccount(client.handshake.query.token, false);
    if (!account) {
      throw new UnauthorizedException();
    }
    return account;
  }

  async getServers() {
    return await this.presence.getServers();
  }
}
