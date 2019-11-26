import {Injectable}                 from "@nestjs/common";
import {ClientProxy}                from "@nestjs/microservices";
import {GameWorld}                  from "../../../../lib/entities/game-world";
import {GetServers, PresenceOnline} from "../actions";

@Injectable()
export class PresenceEmitter {

    constructor(private client: ClientProxy) {

    }

    sendServers(servers: GameWorld[]) {
        this.client.emit(GetServers.event, servers);
    }

    nowOnline() {
        this.client.emit(PresenceOnline.event, {});
    }
}
