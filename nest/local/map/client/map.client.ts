import { Inject, Injectable }   from '@nestjs/common'
import { ClientProxy }          from '@nestjs/microservices'
import {
    ChangeMapChannel,
    FindPlayer,
    GetAllNpcs,
    GetAllPlayers,
    GetMapChannels,
    GetPlayerById,
    PlayerAttemptedTransition,
    PlayerDirections
}                               from '../../../../shared/actions/map.actions'
import { first, takeUntil }     from 'rxjs/operators'
import { LOCAL_CLIENT }         from '../../../client/client.module'
import { Subject }              from 'rxjs'
import { Mob }                  from '../../../../shared/phaser/mob'
import { MapEvent, WorldEvent } from '../../../lib/event.types'


@Injectable()
export class MapClient {

    constructor(@Inject(LOCAL_CLIENT) public client: ClientProxy) {
    }

    getAllPlayers(map: string, channel: number): Promise<Mob[]> {
        return new Promise(resolve => {
            let stop = new Subject()
            this.client.send(new MapEvent(GetAllPlayers.type, map, channel), new GetAllPlayers())
                .pipe(takeUntil(stop))
                .subscribe(data => {
                    stop.next()
                    resolve(data)
                })
        })
    }

    async getAllNpcs(map: string, channel: number): Promise<Mob[]> {
        return new Promise(resolve => {
            let stop = new Subject()
            this.client.send(new MapEvent(GetAllNpcs.type, map, channel), new GetAllNpcs())
                .pipe(takeUntil(stop))
                .subscribe(data => {
                    stop.next()
                    resolve(data)
                })
        })
    }

    async getPlayer(characterId: number, map: string, channel: number): Promise<{ x: number, y: number }> {
        return await this.client.send(
            new MapEvent(GetPlayerById.type, map, channel),
            new GetPlayerById(characterId)).pipe(first()
        ).toPromise()
    }

    playerDirectionalInput(characterId: number, map: string, channel: number, directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {
        this.client.emit(
            new MapEvent(PlayerDirections.type, map, channel),
            new PlayerDirections(characterId, directions)
        )
    }

    async playerAttemptedTransition(characterId: number, map: string, currentChannel: number) {
        return await this.client.send(
            new MapEvent(PlayerAttemptedTransition.type, map, currentChannel),
            new PlayerAttemptedTransition(characterId)
        ).pipe(first()).toPromise()
    }

    getChannels(map: string) {
        return new Promise(resolve => {
            let stop = new Subject()
            this.client.send(new WorldEvent(GetMapChannels.type, map), {})
                .pipe(takeUntil(stop))
                .subscribe(channels => {
                    stop.next()
                    resolve(channels)
                })
        })
    }

    findPlayer(id: number) {
        return new Promise(resolve => {
            let stop = new Subject()
            this.client.send(new WorldEvent(FindPlayer.type), new FindPlayer(id))
                .pipe(takeUntil(stop))
                .subscribe(position => {
                    stop.next()
                    resolve(position)
                })
        })
    }

    changeChannel(characterId: number, map: string, currentChannel: number, channel: number) {
        this.client.emit(new MapEvent(ChangeMapChannel.type, map, currentChannel), new ChangeMapChannel(characterId, channel))
    }
}
