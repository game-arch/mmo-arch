import {Inject, Injectable}                                     from "@nestjs/common";
import {ClientProxy}                                            from "@nestjs/microservices";
import {AllPlayers, MapOnline, PlayerEnteredMap, PlayerLeftMap} from "./actions";
import {WORLD_PREFIX}                                           from "../world/world.prefix";
import {LocalMessage}                                           from "../world/chat/actions";

@Injectable()
export class MapEmitter {

    constructor(@Inject('WORLD_CLIENT') private client: ClientProxy) {

    }

    playerJoinedMap(map: string, characterId: number, name: string, x: number, y: number) {
        this.client.emit(WORLD_PREFIX + PlayerEnteredMap.event, new PlayerEnteredMap(characterId, name, map, x, y));
    }

    playerLeftMap(map: string, characterId: number, name: string) {
        this.client.emit(WORLD_PREFIX + PlayerLeftMap.event, new PlayerLeftMap(characterId, name, map));
    }

    allPlayers(map: string, players: { characterId: number, x: number, y: number, moving: { up: boolean, down: boolean, left: boolean, right: boolean } }[]) {
        this.client.emit(WORLD_PREFIX + AllPlayers.event, new AllPlayers(map, players));
    }

    nowOnline() {
        this.client.emit(WORLD_PREFIX + MapOnline.event, {});
    }
}
