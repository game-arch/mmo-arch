import {Injectable}                                  from "@nestjs/common";
import {ClientProxy}                                 from "@nestjs/microservices";
import {AllPlayers, PlayerEnteredMap, PlayerLeftMap} from "./actions";

@Injectable()
export class MapEmitter {

    constructor(private client: ClientProxy) {

    }

    playerJoinedMap(characterId: number, world: string, map: string, x: number, y: number) {
        this.client.emit(PlayerEnteredMap.event, new PlayerEnteredMap(characterId, world, map, x, y));
    }

    playerLeftMap(characterId: number, world: string, map: string) {
        this.client.emit(PlayerLeftMap.event, new PlayerLeftMap(characterId, world, map));
    }

    allPlayers(world:string, map:string, players:{characterId:number, x:number, y:number}[]) {
        this.client.emit(AllPlayers.event, new AllPlayers(world, map, players));
    }
}
