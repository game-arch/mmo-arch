import {Injectable}                                               from "@nestjs/common";
import {ClientProxy}                                              from "@nestjs/microservices";
import {GetAllPlayers, GetPlayerPosition, PlayerDirectionalInput} from "../actions";
import {first}                                                    from "rxjs/operators";

@Injectable()
export class MapClient {

    constructor(private client: ClientProxy) {

    }

    async getAllPlayers(map: string) {
        return await this.client.send(GetAllPlayers.event, new GetAllPlayers(map)).pipe(first()).toPromise();
    }

    async getPlayer(characterId: number, map: string): Promise<{x:number,y:number}> {
        return await this.client.send(GetPlayerPosition.event + '.' + map, new GetPlayerPosition(characterId)).pipe(first()).toPromise();
    }

    playerDirectionalInput(characterId: number, world: string, map: string, directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {
        this.client.emit(PlayerDirectionalInput.event, new PlayerDirectionalInput(characterId, map, directions));
    }
}
