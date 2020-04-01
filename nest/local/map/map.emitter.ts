import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy }        from '@nestjs/microservices'
import {
    ChangedMapChannel,
    MapChannels,
    MapOnline,
    NpcAdded,
    NpcUpdate,
    PlayerChangedMap,
    PlayerEnteredMap,
    PlayerLeftMap,
    PlayerUpdate
}                       from '../../../shared/events/map.events'
import { WORLD_PREFIX } from '../world/world.prefix'
import { LOCAL_CLIENT } from '../../client/client.module'
import { Mob }          from '../../../shared/phaser/mob'
import { MapConstants } from './constants'

@Injectable()
export class MapEmitter {

    constructor(@Inject(LOCAL_CLIENT) private client: ClientProxy) {

    }

    playerJoinedMap(map: string, channel: number, characterId: number, name: string, x: number, y: number) {
        this.client.emit(WORLD_PREFIX + PlayerEnteredMap.event, new PlayerEnteredMap(characterId, name, map, channel, x, y))
    }

    playerLeftMap(map: string, channel: number, characterId: number, name: string) {
        this.client.emit(WORLD_PREFIX + PlayerLeftMap.event, new PlayerLeftMap(characterId, name, map, channel))
    }

    addedNpc(map: string, instanceId: number, mobId: number, name: string, x: number, y: number) {
        this.client.emit(WORLD_PREFIX + NpcAdded.event + '.broadcast', new NpcAdded(mobId, instanceId, name, map, x, y))
    }

    playerUpdate(map: string, channel: number, player: Mob) {
        this.client.emit(WORLD_PREFIX + PlayerUpdate.event, new PlayerUpdate(map, channel, player))
    }

    npcUpdate(map: string, channel: number, npc: Mob) {
        this.client.emit(WORLD_PREFIX + NpcUpdate.event, new NpcUpdate(map, channel, npc))
    }

    nowOnline(map: string) {
        this.client.emit(WORLD_PREFIX + MapOnline.event, new MapOnline(map, MapConstants.CHANNEL))
    }

    changedMap(toMap: string, characterId: number, newX: number, newY: number, channel: number, entrance?: string) {
        this.client.emit(WORLD_PREFIX + PlayerChangedMap.event, new PlayerChangedMap(characterId, toMap, newX, newY, channel, entrance))
    }

    changedChannel(map: string, channel: number, characterId: number) {
        this.client.emit(WORLD_PREFIX + ChangedMapChannel.event, new ChangedMapChannel(map, channel, characterId))
    }

    instances(characterId: number, map: string, instances: { instanceNumber: number, playerCount: number }[]) {
        this.client.emit(WORLD_PREFIX + MapChannels.event, new MapChannels(characterId, map, instances))
    }
}
