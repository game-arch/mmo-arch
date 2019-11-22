import {PresenceClient} from "../presence/presence.client";
import {config}         from "../../lib/config";
import {Injectable}     from "@nestjs/common";
@Injectable()
export class WorldPresence extends PresenceClient {

    constructor() {
        super('?name=' + (process.env.WORLD_NAME || 'Maiden')
              + '&instanceId='
              + process.env.NODE_APP_INSTANCE
              + '&port=' + config.servers.world.port
              + '&capacity=' + (process.env.CAPACITY || 100));
    }
}
