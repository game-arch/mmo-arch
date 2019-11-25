import {Injectable} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {first, tap} from "rxjs/operators";
import {Events} from "../../../../lib/constants/events";

@Injectable()
export class PresenceClient {

    constructor(private client: ClientProxy) {

    }

    async register(host: string, port: number, constant: string, name: string, instanceId: number): Promise<string> {
        return await this.client.send(Events.REGISTER_SERVER, {
            host,
            port,
            constant,
            name,
            instanceId
        }).pipe(first()).toPromise();
    }

    async getServers() {
        return await this.client.send(Events.SERVER_LIST, {}).pipe(first()).toPromise();
    }

    serverOffline(serverId: number) {
        this.client.emit(Events.SERVER_OFFLINE, {serverId});
    }
}
