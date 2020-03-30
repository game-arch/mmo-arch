import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy }        from '@nestjs/microservices'
import {
    GetAllNpcs,
    GetAllPlayers,
    GetPlayerPosition,
    NpcAdded, NpcDirectionalInput,
    NpcRemoved,
    PlayerAttemptedTransition,
    PlayerDirectionalInput
} from '../actions'
import { first }              from 'rxjs/operators'
import { WORLD_PREFIX }       from '../../world/world.prefix'
import { LOCAL_CLIENT }       from '../../../client/client.module'


@Injectable()
export class MapClient {

    constructor(@Inject(LOCAL_CLIENT) public client: ClientProxy) {
    }

    async getAllPlayers(map: string) {
        return await this.client.send(WORLD_PREFIX + GetAllPlayers.event + '.' + map, new GetAllPlayers()).pipe(first()).toPromise()
    }

    async getAllNpcs(map: string) {
        return await this.client.send(WORLD_PREFIX + GetAllNpcs.event + '.' + map, new GetAllNpcs()).pipe(first()).toPromise()
    }

    async getPlayer(characterId: number, map: string): Promise<{ x: number, y: number }> {
        return await this.client.send(WORLD_PREFIX + GetPlayerPosition.event + '.' + map, new GetPlayerPosition(characterId)).pipe(first()).toPromise()
    }

    playerDirectionalInput(characterId: number, map: string, directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {
        this.client.emit(WORLD_PREFIX + PlayerDirectionalInput.event, new PlayerDirectionalInput(characterId, map, directions))
    }

    playerAttemptedTransition(characterId: number) {
        this.client.emit(WORLD_PREFIX + PlayerAttemptedTransition.event, new PlayerAttemptedTransition(characterId))
    }


    npcAdded(instanceId: number, mobId: number, name: string, map: string, x: number, y: number) {
        this.client.emit(WORLD_PREFIX + NpcAdded.event, new NpcAdded(mobId, instanceId, name, map, x, y))
    }

    npcRemoved(instanceId: number, map: string) {
        this.client.emit(WORLD_PREFIX + NpcRemoved.event, new NpcRemoved(instanceId, map))
    }
    npcDirectionalInput(instanceId: number, map: string, directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {
        this.client.emit(WORLD_PREFIX + NpcDirectionalInput.event, new NpcDirectionalInput(instanceId, map, directions))
    }
}
