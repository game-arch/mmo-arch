import { Inject, Injectable }                                       from '@nestjs/common'
import { ClientProxy }                                                                         from '@nestjs/microservices'
import { GetAllPlayers, GetPlayerPosition, PlayerAttemptedTransition, PlayerDirectionalInput } from '../actions'
import { first }                                                                               from 'rxjs/operators'
import { WORLD_PREFIX }                                             from '../../world/world.prefix'
import { LOCAL_CLIENT }                                             from '../../../client/client.module'


@Injectable()
export class MapClient {

    constructor(@Inject(LOCAL_CLIENT) public client: ClientProxy) {
    }

    async getAllPlayers(map: string) {
        return await this.client.send(WORLD_PREFIX + GetAllPlayers.event + '.' + map, new GetAllPlayers()).pipe(first()).toPromise()
    }

    async getPlayer(characterId: number, map: string): Promise<{ x: number, y: number }> {
        return await this.client.send(WORLD_PREFIX + GetPlayerPosition.event + '.' + map, new GetPlayerPosition(characterId)).pipe(first()).toPromise()
    }

    playerDirectionalInput(characterId: number, world: string, map: string, directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {
        this.client.emit(WORLD_PREFIX + PlayerDirectionalInput.event, new PlayerDirectionalInput(characterId, map, directions))
    }

    playerAttemptedTransition(characterId:number) {
        this.client.emit(WORLD_PREFIX + PlayerAttemptedTransition.event, new PlayerAttemptedTransition(characterId))
    }
}
