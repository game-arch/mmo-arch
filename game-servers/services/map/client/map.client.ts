import {Injectable}                            from "@nestjs/common";
import {ClientProxy}                           from "@nestjs/microservices";
import {GetAllPlayers, PlayerDirectionalInput} from "../actions";
import {first}                                 from "rxjs/operators";

@Injectable()
export class MapClient {

    constructor(private client: ClientProxy) {

    }

    async getAllPlayers(world: string, map: string) {
        return await this.client.send(GetAllPlayers.event, new GetAllPlayers(world, map)).pipe(first()).toPromise();
    }

    playerDirectionalInput(characterId: number, world: string, map: string, directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {
        this.client.emit(PlayerDirectionalInput.event, new PlayerDirectionalInput(characterId, world, map, directions));
    }
}
