import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy }        from '@nestjs/microservices'
import {
    ChangeMapChannel,
    FindPlayer,
    GetAllNpcs,
    GetAllPlayers,
    GetMapChannels,
    GetPlayerPosition,
    PlayerAttemptedTransition,
    PlayerDirectionalInput
}                             from '../../../../shared/events/map.events'
import { first, takeUntil }   from 'rxjs/operators'
import { WORLD_PREFIX }       from '../../world/world.prefix'
import { LOCAL_CLIENT }       from '../../../client/client.module'
import { Subject }            from 'rxjs'


@Injectable()
export class MapClient {

    constructor(@Inject(LOCAL_CLIENT) public client: ClientProxy) {
    }

    async getAllPlayers(map: string, channel: number) {
        return await this.client.send(WORLD_PREFIX + GetAllPlayers.event + '.' + map + '.' + channel, new GetAllPlayers()).pipe(first()).toPromise()
    }

    async getAllNpcs(map: string, channel: number) {
        return await this.client.send(WORLD_PREFIX + GetAllNpcs.event + '.' + map + '.' + channel, new GetAllNpcs()).pipe(first()).toPromise()
    }

    async getPlayer(characterId: number, map: string, channel: number): Promise<{ x: number, y: number }> {
        return await this.client.send(WORLD_PREFIX + GetPlayerPosition.event + '.' + map + '.' + channel, new GetPlayerPosition(characterId)).pipe(first()).toPromise()
    }

    playerDirectionalInput(characterId: number, map: string, channel: number, directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {
        this.client.emit(WORLD_PREFIX + PlayerDirectionalInput.event + '.' + map + '.' + channel, new PlayerDirectionalInput(characterId, directions))
    }

    async playerAttemptedTransition(characterId: number, map: string, channel: number) {
        return await this.client.send(WORLD_PREFIX + PlayerAttemptedTransition.event + '.' + map + '.' + channel, new PlayerAttemptedTransition(characterId, channel)).pipe(first()).toPromise()
    }

    async getChannels(map: string, channel: number) {
        return await this.client.send(WORLD_PREFIX + GetMapChannels.event + '.' + map + '.' + channel, {}).pipe(first()).toPromise()
    }

    findPlayer(id: number) {
        return new Promise(resolve => {
            let stop = new Subject()
            this.client.send(WORLD_PREFIX + FindPlayer.event, new FindPlayer(id))
                .pipe(takeUntil(stop))
                .subscribe(position => {
                    stop.next()
                    resolve(position)
                })
        })
    }

    changeChannel(characterId: number, channel: number) {
        this.client.emit(WORLD_PREFIX + ChangeMapChannel.event, new ChangeMapChannel(characterId, channel))
    }
}
