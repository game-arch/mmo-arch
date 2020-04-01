import { Controller, Get, Logger, OnApplicationBootstrap, OnApplicationShutdown, Req, Res } from '@nestjs/common'
import { MapService }                                                                       from './map.service'
import { EventPattern, MessagePattern }                                                     from '@nestjs/microservices'
import {
    CharacterLoggedIn,
    CharacterLoggedOut
}                                                                                           from '../../../shared/events/character.events'
import {
    ChangeMapChannel,
    FindPlayer,
    GetAllNpcs,
    GetAllPlayers,
    GetMapChannels,
    GetPlayerPosition,
    PlayerAttemptedTransition,
    PlayerChangedMap,
    PlayerDirectionalInput
}                                                                                           from '../../../shared/events/map.events'
import { Request, Response }                                                                from 'express'
import { MapEmitter }                                                                       from './map.emitter'
import { MapConstants }                                                                     from './constants'
import { WORLD_PREFIX }                                                                     from '../world/world.prefix'
import { InjectRepository }                                                                 from '@nestjs/typeorm'
import { Player }                                                                           from './entities/player'
import { getConnection, Repository }                                                        from 'typeorm'
import { from }                                                                             from 'rxjs'
import { map, tap, toArray }                                                                from 'rxjs/operators'
import { Channel }                                                                          from './entities/channel'

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

    @MessagePattern(WORLD_PREFIX + GetAllPlayers.event + '.' + MapConstants.MAP + '.' + MapConstants.CHANNEL)
    getAllPlayers(data: GetAllPlayers) {
        return this.service.map.getAllPlayers()
    }

    @MessagePattern(WORLD_PREFIX + GetAllNpcs.event + '.' + MapConstants.MAP + '.' + MapConstants.CHANNEL)
    getAllNpcs(data: GetAllNpcs) {
        return this.service.map.getAllNpcs()
    }

    @EventPattern(WORLD_PREFIX + PlayerChangedMap.event)
    async changedMap(data: PlayerChangedMap) {
        // this.logger.log(PlayerChangedMap.event)
        await this.service.changedMaps(data)
    }

    @MessagePattern(WORLD_PREFIX + PlayerAttemptedTransition.event + '.' + MapConstants.MAP + '.' + MapConstants.CHANNEL)
    async attemptedTransition(data: PlayerAttemptedTransition) {
        // this.logger.log(PlayerAttemptedTransition.event)
        return await this.service.attemptTransition(data.characterId, data.channel)
    }

    @EventPattern(WORLD_PREFIX + CharacterLoggedIn.event)
    async characterLoggedIn(data: CharacterLoggedIn) {
        await this.service.loggedIn(data.characterId, data.name, data.channel)
    }

    @EventPattern(WORLD_PREFIX + ChangeMapChannel.event + '.' + MapConstants.MAP)
    async changeInstance(data: ChangeMapChannel) {
        // this.logger.log(ChangeMapChannel.event)
        await this.service.changeInstance(data)
    }

    @EventPattern(WORLD_PREFIX + CharacterLoggedOut.event)
    async characterLoggedOut(data: CharacterLoggedOut) {
        // this.logger.log(CharacterLoggedOut.event)
        await this.service.loggedOut(data.characterId)
    }

    @EventPattern(WORLD_PREFIX + PlayerDirectionalInput.event + '.' + MapConstants.MAP + '.' + MapConstants.CHANNEL)
    async playerMoved(data: PlayerDirectionalInput) {
        this.service.map.moveEntity('player', data.id, data.directions)
    }

    @MessagePattern(WORLD_PREFIX + GetPlayerPosition.event + '.' + MapConstants.MAP + '.' + MapConstants.CHANNEL)
    getPlayer(data: GetPlayerPosition) {
        return this.service.getPlayerPosition(data.id)
    }

    @MessagePattern(WORLD_PREFIX + FindPlayer.event)
    async findPlayer(data: FindPlayer) {
        return await this.service.findPlayer(data.id)
    }

    @MessagePattern(WORLD_PREFIX + GetMapChannels.event + '.' + MapConstants.MAP + '.' + MapConstants.CHANNEL)
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
