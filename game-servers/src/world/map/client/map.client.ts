import {Injectable}    from "@nestjs/common";
import {ClientProxy}   from "@nestjs/microservices";
import {GetAllPlayers} from "../actions";
import {first}         from "rxjs/operators";

@Injectable()
export class MapClient {

    constructor(private client: ClientProxy) {

    }

    async getAllPlayers(world: string, map: string) {
        return await this.client.send(GetAllPlayers.event, new GetAllPlayers(world, map)).pipe(first()).toPromise();
    }
}
