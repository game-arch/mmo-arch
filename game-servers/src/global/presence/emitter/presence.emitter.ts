import {Injectable}  from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {GameWorld}   from "../../../../lib/entities/game-world";
import {Events}      from "../../../../lib/constants/events";

@Injectable()
export class PresenceEmitter {

    constructor(private client: ClientProxy) {

    }

    sendServers(servers: GameWorld[]) {
        this.client.emit(Events.SERVER_LIST, servers);
    }

    sendCharacterStatus(worldName: string, user: { serverId, accountId, characterName }, status: 'online' | 'offline') {
        if (status === 'online') {
            this.client.emit(Events.CHARACTER_ONLINE + '.' + worldName, user);
            return;
        }
        this.client.emit(Events.CHARACTER_OFFLINE + '.' + worldName, user);
    }

    nowOnline() {
        this.client.emit(Events.PRESENCE_ONLINE, {});
    }
}
