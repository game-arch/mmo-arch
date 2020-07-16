import { Controller, Get, Logger, OnApplicationBootstrap, OnApplicationShutdown, Req, Res } from '@nestjs/common'
import { MapService }                                                                       from './map.service'
import { EventPattern, MessagePattern } from '@nestjs/microservices'
import {
    CharacterLoggedIn,
    CharacterLoggedOut
}                                       from '../../../shared/actions/character.actions'
import {
    ChangeMapChannel,
    FindPlayer,
    GetAllNpcs,
    GetAllPlayers,
    GetMapChannels,
    GetPlayerById,
    PlayerAttemptedTransition,
    PlayerChangedMap,
    PlayerDirections
}                                       from '../../../shared/actions/map.actions'
import { Request, Response }            from 'express'
import { MapEmitter }                                                                       from './map.emitter'
import { MapConstants }                                                                     from './constants'
import { InjectRepository }                                                                 from '@nestjs/typeorm'
import { Player }                                                                           from './entities/player'
import { getConnection, Repository }                                                        from 'typeorm'
import { from }                                                                             from 'rxjs'
import { map, tap, toArray }                                                                from 'rxjs/operators'
import { Channel }              from './entities/channel'
import { MapEvent, WorldEvent } from '../../lib/event.types'

@Controller()
export class MapController implements OnApplicationBootstrap, OnApplicationShutdown {
    instance: Channel

    constructor(
        private logger: Logger,
        private readonly emitter: MapEmitter,
        private readonly service: MapService,
        @InjectRepository(Player) private playerRepo: Repository<Player>,
        @InjectRepository(Channel) private instances: Repository<Channel>
    ) {
    }

    @Get('players')
    getPlayers(@Req() request: Request, @Res() response: Response) {
        return this.service.map.getAllPlayers()
    }

    @MessagePattern(new MapEvent(GetAllPlayers.type))
    getAllPlayers(data: GetAllPlayers) {
        return this.service.map.getAllPlayers()
    }

    @MessagePattern(new MapEvent(GetAllNpcs.type))
    getAllNpcs(data: GetAllNpcs) {
        return this.service.map.getAllNpcs()
    }

    @EventPattern(new WorldEvent(PlayerChangedMap.type))
    async changedMap(data: PlayerChangedMap) {
        // this.logger.log(PlayerChangedMap.event)
        await this.service.changedMaps(data)
    }

    @MessagePattern(new MapEvent(PlayerAttemptedTransition.type))
    async attemptedTransition(data: PlayerAttemptedTransition) {
        // this.logger.log(PlayerAttemptedTransition.event)
        return await this.service.attemptTransition(data.characterId)
    }

    @EventPattern(new WorldEvent(CharacterLoggedIn.type))
    async characterLoggedIn(data: CharacterLoggedIn) {
        await this.service.loggedIn(data.characterId, data.name)
    }

    @EventPattern(new MapEvent(ChangeMapChannel.type))
    async changeInstance(data: ChangeMapChannel) {
        // this.logger.log(ChangeMapChannel.event)
        await this.service.changeInstance(data)
    }

    @EventPattern(new WorldEvent(CharacterLoggedOut.type))
    async characterLoggedOut(data: CharacterLoggedOut) {
        this.logger.log(CharacterLoggedOut.type)
        await this.service.loggedOut(data.characterId)
    }

    @EventPattern(new MapEvent(PlayerDirections.type))
    async playerMoved(data: PlayerDirections) {
        this.service.map.moveEntity('player', data.id, data.directions)
    }

    @MessagePattern(new MapEvent(GetPlayerById.type))
    getPlayer(data: GetPlayerById) {
        return this.service.getPlayer(data.id)
    }

    @MessagePattern(new WorldEvent(FindPlayer.type))
    async findPlayer(data: FindPlayer) {
        return await this.service.findPlayer(data.id)
    }

    @MessagePattern(new WorldEvent(GetMapChannels.type, MapConstants.MAP))
    async getChannels() {
        // this.logger.log(GetMapChannels.event)
        return await this.service.getChannels(MapConstants.MAP)
    }


    async onApplicationBootstrap() {
        this.service.init()
        let connection = await getConnection()
        await connection.query('Update player set online = 0 where map = ? and channel = ?', [MapConstants.MAP, MapConstants.CHANNEL])
        this.instance = await this.instances.findOne({ map: MapConstants.MAP, channel: MapConstants.CHANNEL })
        if (!this.instance) {
            this.instance         = new Channel()
            this.instance.channel = MapConstants.CHANNEL
            this.instance.map     = MapConstants.MAP
        }
        this.instance.online = true
        await this.instances.save(this.instance)
        this.logger.log('Ready for Connections!')
        this.emitter.nowOnline(this.service.map.constant)
    }

    async onApplicationShutdown(signal?: string) {
        this.service.stop()
        await getConnection().connect()
        const players        = await from(Object.keys(this.service.map.players))
            .pipe(map(key => this.service.map.players[key]), tap(player => player.online = false), toArray())
            .toPromise()
        this.instance.online = false
        await this.instances.save(this.instance)
        await this.playerRepo.save(players)
        this.logger.log('Saved Players!')
    }
}
