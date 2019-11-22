import {Injectable}  from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {first, tap}  from "rxjs/operators";
import {Events}      from "../../../../lib/constants/events";
import {GameWorld}   from "../../../../lib/entities/game-world";

@Injectable()
export class PresenceClient {

    constructor(private client: ClientProxy) {

    }

    async register(host: string, port: number, name: string, instanceId: number): Promise<string> {
        return await this.client.send(Events.REGISTER_SERVER, {host, port, name, instanceId}).pipe(first()).toPromise();
    }

    async userOnline(serverId: number, accountId: number) {
        return await this.client.send(Events.USER_CONNECTED, {serverId, accountId}).pipe(first()).toPromise();
    }

    async userOffline(serverId: number, accountId: number) {
        return await this.client.send(Events.USER_DISCONNECTED, {serverId, accountId}).pipe(first()).toPromise();
    }

    async characterOnline(accountId: number, name: string) {
        return await this.client.send(Events.CHARACTER_ONLINE, {name, accountId}).pipe(first()).toPromise();
    }

    async characterOffline(accountId: number) {
        return await this.client.send(Events.CHARACTER_OFFLINE, {accountId}).pipe(first()).toPromise();
    }

    async getServers() {
        return await this.client.send(Events.SERVER_LIST, {}).pipe(first()).toPromise();
    }

    sendServers(servers: GameWorld[]) {
        this.client.emit(Events.SERVER_LIST, servers);
    }

    sendCharacterStatus(serverId: number, worldName: string, accountId: number, name: string, status: 'online' | 'offline') {
        if (status === 'online') {
            this.client.emit(Events.CHARACTER_ONLINE + '.' + worldName, {serverId, accountId, name});
            return;
        }
        this.client.emit(Events.CHARACTER_OFFLINE + '.' + worldName, {serverId, accountId, name});
    }
}
