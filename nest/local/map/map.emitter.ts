import { Inject, Injectable }                                                   from '@nestjs/common'
import { ClientProxy }                                                          from '@nestjs/microservices'
import { AllPlayers, MapOnline, PlayerEnteredMap, PlayerLeftMap, PlayerUpdate } from './actions'
import { WORLD_PREFIX }                                                         from '../world/world.prefix'
import { LOCAL_CLIENT }                                                         from '../../client/client.module'

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

    allPlayers(map: string, players: { id: number, name: string, x: number, y: number, moving: { up: boolean, down: boolean, left: boolean, right: boolean } }[]) {
        this.client.emit(WORLD_PREFIX + AllPlayers.event, new AllPlayers(map, players))
    }

    playerUpdate(map: string, player: { id: number, name: string, x: number, y: number, moving: { up: boolean, down: boolean, left: boolean, right: boolean } }) {
        this.client.emit(WORLD_PREFIX + PlayerUpdate.event, new PlayerUpdate(map, player))
    }

    nowOnline() {
        this.client.emit(WORLD_PREFIX + MapOnline.event, {})
    }
}
