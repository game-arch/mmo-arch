import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy }        from '@nestjs/microservices'
import {
    AllNpcs,
    AllPlayers,
    MapOnline,
    NpcAdded,
    NpcRemoved,
    PlayerChangedMap,
    PlayerEnteredMap,
    PlayerLeftMap,
    PlayerUpdate
}                             from './actions'
import { WORLD_PREFIX }       from '../world/world.prefix'
import { LOCAL_CLIENT }       from '../../client/client.module'
import { Mob }                from '../../../shared/phaser/mob'

@Injectable()
export class MapEmitter {

    constructor(@Inject(LOCAL_CLIENT) private client: ClientProxy) {

    }

    playerJoinedMap(map: string, characterId: number, name: string, x: number, y: number) {
        this.client.emit(WORLD_PREFIX + PlayerEnteredMap.event, new PlayerEnteredMap(characterId, name, map, x, y))
    }

    playerLeftMap(map: string, characterId: number, name: string) {
        this.client.emit(WORLD_PREFIX + PlayerLeftMap.event, new PlayerLeftMap(characterId, name, map))
    }

    addedNpc(map: string, instanceId: number, mobId: number, name: string, x: number, y: number) {
        this.client.emit(WORLD_PREFIX + NpcAdded.event + '.broadcast', new NpcAdded(mobId, instanceId, name, map, x, y))
    }

    removedNpc(map: string, instanceId: number) {
        this.client.emit(WORLD_PREFIX + NpcRemoved.event + '.broadcast', new NpcRemoved(instanceId, map))
    }

    allNpcs(map: string, npcs: Mob[]) {
        this.client.emit(WORLD_PREFIX + AllNpcs.event, new AllNpcs(map, npcs))
    }

    allPlayers(map: string, players: Mob[]) {
        this.client.emit(WORLD_PREFIX + AllPlayers.event, new AllPlayers(map, players))
    }

    playerUpdate(map: string, player: Mob) {
        this.client.emit(WORLD_PREFIX + PlayerUpdate.event, new PlayerUpdate(map, player))
    }

    nowOnline(map: string) {
        this.client.emit(WORLD_PREFIX + MapOnline.event, new MapOnline(map))
    }

    changedMap(toMap: string, characterId: number, newX: number, newY: number, entrance?: string) {
        this.client.emit(WORLD_PREFIX + PlayerChangedMap.event, new PlayerChangedMap(characterId, toMap, newX, newY, entrance))
    }
}
