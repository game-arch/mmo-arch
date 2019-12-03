import {Injectable}                                             from "@nestjs/common";
import {ClientProxy}                                            from "@nestjs/microservices";
import {AllPlayers, MapOnline, PlayerEnteredMap, PlayerLeftMap} from "./actions";

@Injectable()
export class MapEmitter {

    constructor(private client: ClientProxy) {

    }

    playerJoinedMap(map: string, characterId: number, name: string, x: number, y: number) {
        this.client.emit(PlayerEnteredMap.event, new PlayerEnteredMap(characterId, name, map, x, y));
    }

    playerLeftMap(map: string, characterId: number, name: string) {
        this.client.emit(PlayerLeftMap.event, new PlayerLeftMap(characterId, name, map));
    }

    allPlayers(map: string, players: { characterId: number, x: number, y: number, moving: { up: boolean, down: boolean, left: boolean, right: boolean } }[]) {
        this.client.emit(AllPlayers.event, new AllPlayers(map, players));
    }

    nowOnline() {
        this.client.emit(MapOnline.event, {});
    }
}
