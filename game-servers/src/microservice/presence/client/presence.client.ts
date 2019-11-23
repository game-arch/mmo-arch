import {Injectable}  from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {first, tap}  from "rxjs/operators";
import {Events}      from "../../../../lib/constants/events";

@Injectable()
export class PresenceClient {

    constructor(private client: ClientProxy) {

    }

    async register(host: string, port: number, name: string, instanceId: number): Promise<string> {
        return await this.client.send(Events.REGISTER_SERVER, {host, port, name, instanceId}).pipe(first()).toPromise();
    }

    async getServers() {
        return await this.client.send(Events.SERVER_LIST, {}).pipe(first()).toPromise();
    }

    userOnline(serverId: number, accountId: number) {
        this.client.emit(Events.USER_CONNECTED, {serverId, accountId});
    }

    userOffline(serverId: number, accountId: number) {
        this.client.emit(Events.USER_DISCONNECTED, {serverId, accountId});
    }

    characterOnline(accountId: number, name: string) {
        this.client.emit(Events.CHARACTER_ONLINE, {name, accountId});
    }

    characterOffline(accountId: number) {
        this.client.emit(Events.CHARACTER_OFFLINE, {accountId});
    }


    serverOffline(serverId: number) {
        this.client.emit(Events.SERVER_OFFLINE, {serverId});
    }
}
