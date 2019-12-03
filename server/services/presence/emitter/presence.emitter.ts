import {Inject, Injectable}         from "@nestjs/common";
import {ClientProxy}                from "@nestjs/microservices";
import {GameWorld}                  from "../../../lib/interfaces/game-world";
import {GetServers, PresenceOnline} from "../actions";

@Injectable()
export class PresenceEmitter {

    constructor(@Inject('WORLD_CLIENT') private client: ClientProxy) {

    }

    sendServers(servers: GameWorld[]) {
        this.client.emit(GetServers.event, servers);
    }

    nowOnline() {
        this.client.emit(PresenceOnline.event, {});
    }
}
