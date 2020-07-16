import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy }  from '@nestjs/microservices'
import {
    MapChannels,
    MapOnline,
    NpcAdded,
    NpcUpdate,
    PlayerChangedMap,
    PlayerEnteredMap,
    PlayerLeftMap,
    PlayerUpdate
}                       from '../../../shared/actions/map.actions'
import { LOCAL_CLIENT } from '../../client/client.module'
import { Mob }                from '../../../shared/phaser/mob'
import { MapConstants } from './constants'
import { WorldEvent }   from '../../lib/event.types'

@Injectable()
export class MapEmitter {

    constructor(@Inject(LOCAL_CLIENT) private client: ClientProxy) {

    }

    playerJoinedMap(map: string, channel: number, characterId: number, name: string, x: number, y: number) {
        this.client.emit(new WorldEvent(PlayerEnteredMap.type), new PlayerEnteredMap(characterId, name, map, channel, x, y))
    }

    playerLeftMap(map: string, channel: number, characterId: number, name: string) {
        this.client.emit(new WorldEvent(PlayerLeftMap.type), new PlayerLeftMap(characterId, name, map, channel))
    }

    addedNpc(map: string, instanceId: number, mobId: number, name: string, x: number, y: number) {
        this.client.emit(new WorldEvent(NpcAdded.type + '.broadcast'), new NpcAdded(mobId, instanceId, name, map, x, y))
    }

    playerUpdate(map: string, channel: number, player: Mob) {
        this.client.emit(new WorldEvent(PlayerUpdate.type), new PlayerUpdate(map, channel, player))
    }

    npcUpdate(map: string, channel: number, npc: Mob) {
        this.client.emit(new WorldEvent(NpcUpdate.type), new NpcUpdate(map, channel, npc))
    }

    nowOnline(map: string) {
        this.client.emit(new WorldEvent(MapOnline.type), new MapOnline(map, MapConstants.CHANNEL))
    }

    changedMap(toMap: string, characterId: number, newX: number, newY: number, channel: number, entrance?: string) {
        this.client.emit(new WorldEvent(PlayerChangedMap.type), new PlayerChangedMap(characterId, toMap, newX, newY, channel, entrance))
    }

    channels(characterId: number, map: string, channels: { channel: number, playerCount: number, playerCapacity: number }[]) {
        this.client.emit(new WorldEvent(MapChannels.type), new MapChannels(characterId, map, channels))
    }
}
