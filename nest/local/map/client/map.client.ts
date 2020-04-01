import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy }        from '@nestjs/microservices'
import {
    ChangeMapChannel,
    GetAllNpcs,
    GetAllPlayers,
    GetPlayerPosition,
    PlayerAttemptedTransition,
    PlayerDirectionalInput
}                             from '../../../../shared/events/map.events'
import { first }              from 'rxjs/operators'
import { WORLD_PREFIX }       from '../../world/world.prefix'
import { LOCAL_CLIENT }       from '../../../client/client.module'


@Injectable()
export class MapClient {

    constructor(@Inject(LOCAL_CLIENT) public client: ClientProxy) {
    }

    async getAllPlayers(map: string, channel: number) {
        return await this.client.send(WORLD_PREFIX + GetAllPlayers.event + '.' + map, new GetAllPlayers(channel)).pipe(first()).toPromise()
    }

    async getAllNpcs(map: string, channel:number) {
        return await this.client.send(WORLD_PREFIX + GetAllNpcs.event + '.' + map, new GetAllNpcs(channel)).pipe(first()).toPromise()
    }

    async getPlayer(characterId: number, map: string): Promise<{ x: number, y: number }> {
        return await this.client.send(WORLD_PREFIX + GetPlayerPosition.event + '.' + map, new GetPlayerPosition(characterId)).pipe(first()).toPromise()
    }

    playerDirectionalInput(characterId: number, map: string, channel:number, directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {
        this.client.emit(WORLD_PREFIX + PlayerDirectionalInput.event, new PlayerDirectionalInput(characterId, map, channel, directions))
    }

    playerAttemptedTransition(characterId: number, channel: number) {
        this.client.emit(WORLD_PREFIX + PlayerAttemptedTransition.event, new PlayerAttemptedTransition(characterId, channel))
    }

    changeChannel(characterId: number, channel: number) {
        this.client.emit(WORLD_PREFIX + ChangeMapChannel.event, new ChangeMapChannel(characterId, channel))
    }
}
