import { Controller, Get, OnApplicationBootstrap, OnApplicationShutdown, Req, Res } from '@nestjs/common'
import { MapService }                                                               from './map.service'
import { EventPattern, MessagePattern }                                             from '@nestjs/microservices'
import { CharacterLoggedIn, CharacterLoggedOut }                                    from '../character/actions'
import {
    GetAllNpcs,
    GetAllPlayers,
    GetPlayerPosition,
    NpcAdded,
    NpcRemoved,
    PlayerAttemptedTransition,
    PlayerChangedMap,
    PlayerDirectionalInput
}                                                                                   from './actions'
import { Request, Response }                                                        from 'express'
import { MapEmitter }                                                               from './map.emitter'
import { MapConstants }                                                             from './constants'
import { WORLD_PREFIX }                                                             from '../world/world.prefix'
import { InjectRepository }                                                         from '@nestjs/typeorm'
import { Player }                                                                   from './entities/player'
import { getConnection, Repository }                                                from 'typeorm'
import { from }                                                                     from 'rxjs'
import { map, toArray }                                                             from 'rxjs/operators'

@Controller()
export class MapController implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(
        private readonly emitter: MapEmitter,
        private readonly service: MapService,
        @InjectRepository(Player) private playerRepo: Repository<Player>
    ) {
    }

    @Get('players')
    getPlayers(@Req() request: Request, @Res() response: Response) {
        return this.service.map.getAllPlayers()
    }

    @MessagePattern(WORLD_PREFIX + GetAllPlayers.event + '.' + MapConstants.MAP)
    getAllPlayers(data: GetAllPlayers) {
        return this.service.map.getAllPlayers()
    }

    @MessagePattern(WORLD_PREFIX + GetAllNpcs.event + '.' + MapConstants.MAP)
    getAllNpcs(data: GetAllNpcs) {
        return this.service.map.getAllNpcs()
    }

    @EventPattern(WORLD_PREFIX + PlayerChangedMap.event)
    async changedMap(data: PlayerChangedMap) {
        await this.service.changedMaps(data.id, data.map, data.newX, data.newY, data.entrance)
    }

    @EventPattern(WORLD_PREFIX + PlayerAttemptedTransition.event)
    async attemptedTransition(data: PlayerAttemptedTransition) {
        await this.service.attemptTransition(data.characterId)
    }

    @EventPattern(WORLD_PREFIX + CharacterLoggedIn.event)
    async characterLoggedIn(data: CharacterLoggedIn) {
        await this.service.loggedIn(data.characterId, data.name)
    }

    @EventPattern(WORLD_PREFIX + CharacterLoggedOut.event)
    async characterLoggedOut(data: CharacterLoggedOut) {
        await this.service.loggedOut(data.characterId)
    }

    @EventPattern(WORLD_PREFIX + PlayerDirectionalInput.event)
    async playerMoved(data: PlayerDirectionalInput) {
        if (data.map === this.service.map.constant) {
            this.service.movePlayer(data.id, data.directions)
        }
    }

    @EventPattern(WORLD_PREFIX + NpcAdded.event)
    async npcAdded(data: NpcAdded) {
        if (data.map === this.service.map.constant) {
            if (!this.service.map.npcs[data.instanceId]) {
                this.service.map.addNpc(data)
                this.emitter.addedNpc(data.map, data.instanceId, data.mobId, data.name, data.x, data.y)
            }
        }
    }

    @EventPattern(WORLD_PREFIX + NpcRemoved.event)
    async npcRemoved(data: NpcRemoved) {
        if (data.map === this.service.map.constant) {
            if (this.service.map.npcs[data.instanceId]) {
                this.service.map.removeNpc(data.instanceId)
                this.emitter.removedNpc(data.map, data.instanceId)
            }
        }
    }

    @MessagePattern(WORLD_PREFIX + GetPlayerPosition.event + '.' + MapConstants.MAP)
    getPlayer(data: GetPlayerPosition) {
        return this.service.getPlayerPosition(data.id)
    }

    onApplicationBootstrap() {
        this.service.start()
        this.emitter.nowOnline(this.service.map.constant)
    }

    async onApplicationShutdown(signal?: string) {
        this.service.stop()
        await getConnection().connect()
        const players = await from(Object.keys(this.service.map.players))
            .pipe(map(key => this.service.map.players[key]), toArray())
            .toPromise()
        await this.playerRepo.save(players)
        console.log('Saved Players!')
    }
}
