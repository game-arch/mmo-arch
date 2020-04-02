import { Inject, Injectable }                           from '@nestjs/common'
import { MapConstants }                                 from './constants'
import { Repository }                                   from 'typeorm'
import { Player }                                       from './entities/player'
import { InjectRepository }                             from '@nestjs/typeorm'
import { MapEmitter }                                   from './map.emitter'
import { CharacterClient }                              from '../character/client/character.client'
import { Game }                                         from 'phaser'
import { BaseScene }                                    from '../../../shared/phaser/base.scene'
import { NpcConfig }                                    from '../../../shared/interfaces/npc-config'
import { ChangeMapChannel, NpcAdded, PlayerChangedMap } from '../../../shared/events/map.events'
import { Channel }                                      from './entities/channel'
import { MapClient }                                    from './client/map.client'

@Injectable()
export class MapService {

    phaser: Game

    constructor(
        private emitter: MapEmitter,
        private character: CharacterClient,
        private client: MapClient,
        @Inject(MapConstants.MAP) public map: BaseScene,
        @InjectRepository(Player) private players: Repository<Player>,
        @InjectRepository(Channel) private channels: Repository<Channel>
    ) {

        this.phaser = new Game({
            type   : Phaser.HEADLESS,
            width  : 200,
            height : 200,
            banner : false,
            audio  : {
                noAudio: true
            },
            scene  : this.map,
            physics: {
                default: 'arcade',
                arcade : {
                    gravity: { y: 0, x: 0 }
                }
            }
        })

    }


    init() {
        for (let npc of (MapConstants.NPC[MapConstants.MAP] as NpcConfig[])) {
            let data = new NpcAdded(npc.mobId, npc.instanceId, npc.name, npc.map, npc.position[0], npc.position[1])
            this.map.addNpc(data, npc)
            this.emitter.addedNpc(data.map, data.instanceId, data.mobId, data.name, data.x, data.y)
        }
        this.map.savePlayer = async (player) => {
            this.map.players[player.id].x = player.x
            this.map.players[player.id].y = player.y
            await this.players.save(this.map.players[player.id])
        }
        this.map.emitPlayer = (player) => this.emitter.playerUpdate(this.map.constant, MapConstants.CHANNEL, player.asPayload(this.map.constant))
        this.map.emitMob    = (npc) => this.emitter.npcUpdate(this.map.constant, MapConstants.CHANNEL, npc.asPayload(this.map.constant))
    }

    async findPlayer(id: number): Promise<Player> {
        return await this.players.findOne(id)
    }

    stop() {
        this.phaser.scene.stop(this.map.constant)
    }

    async attemptTransition(characterId: number, channel?: number) {
        if (this.map.canTransition[characterId]) {
            let { mob, landingMap, landingId } = this.map.canTransition[characterId]
            let player                         = await this.players.findOne(characterId)
            let count                          = await this.players.count({
                channel: channel || player.channel,
                online : true,
                map    : landingMap
            })
            if (count < MapConstants.CAPACITY) {
                this.emitter.changedMap(landingMap, mob.id, mob.x, mob.y, channel || player.channel, landingId)
                return { status: true, map: landingMap, reason: '' }
            } else {
                await this.sendChannels(landingMap, player)
                return { status: false, map: landingMap, reason: 'channel' }
            }
        }
        return { status: false, map: null, reason: 'no_transition_available' }
    }

    private async sendChannels(landingMap: string, player: Player) {
        let list = await this.getChannels(landingMap)
        this.emitter.channels(player.id, landingMap, list)
    }

    async getChannels(map: string) {
        let instances                                                                = await this.channels.find({ map: map })
        let list: { channel: number, playerCount: number, playerCapacity: number }[] = []
        for (let row of instances) {
            let instance = {
                channel       : row.channel,
                playerCount   : await this.players.count({
                    channel: row.channel,
                    online : true,
                    map    : map
                }),
                playerCapacity: MapConstants.CAPACITY
            }
            list.push(instance)
        }
        return list
    }

    async changedMaps(data: PlayerChangedMap) {
        const player = await this.players.findOne(data.id)
        if (player) {
            if (data.map === this.map.constant && data.channel === MapConstants.CHANNEL) {
                player.map     = data.map
                let transition = this.map.config.layers.transitions ? this.map.config.layers.transitions.entrances[data.entrance] || null : null
                player.channel = data.channel
                if (transition) {
                    player.x = transition[0]
                    player.y = transition[1]
                } else {
                    player.x = data.newX
                    player.y = data.newY
                }
                await this.players.save(player)
                this.playerJoinedMap(player)
            } else {
                this.playerLeftMap(player)
            }
        }
    }

    async loggedIn(characterId: number, name: string, channel: number = 1) {
        let player = await this.players.findOne({ id: characterId })
        if (!player && this.map.constant === 'tutorial' && MapConstants.CHANNEL === 1) {
            player = this.players.create({
                id     : characterId,
                map    : 'tutorial',
                online : true,
                channel: channel,
                x      : 100,
                y      : 100
            })
        }
        if (player && player.map === this.map.constant && (channel === MapConstants.CHANNEL)) {
            player.name   = name
            player.online = true
            let count     = await this.players.count({ channel: channel, map: MapConstants.MAP, online: true })
            if (count < MapConstants.CAPACITY) {
                player.channel = channel
                await this.players.save(player)
                this.playerJoinedMap(player)
            } else {
                await this.players.save(player)
                this.sendChannels(MapConstants.MAP, player)
            }
        }
    }

    async changeInstance(data: ChangeMapChannel) {
        const player = await this.players.findOne({ id: data.characterId, map: MapConstants.MAP })
        if (player) {
            let count = await this.players.count({ channel: data.channel, map: MapConstants.MAP, online: true })
            if (count < MapConstants.CAPACITY) {
                this.emitter.changedMap(MapConstants.MAP, player.id, player.x, player.y, data.channel)
            } else {
                this.sendChannels(MapConstants.MAP, player)
            }
        }
    }

    async loggedOut(characterId: number) {
        let player = await this.players.findOne(characterId)
        if (player && player.map === this.map.constant && player.channel === MapConstants.CHANNEL) {
            if (this.map.players[player.id]) {
                player        = this.map.players[player.id] as Player
                player.online = false
                await this.players.save(player)
                this.playerLeftMap(player)
                return
            }
        }
    }

    getPlayerPosition(characterId: number) {
        const player = this.map.playerSprites[characterId]
        if (player) {
            return {
                x: player.x,
                y: player.y
            }
        }
        return null
    }

    private playerJoinedMap(player: Player) {
        if (player && !this.map.playerSprites[player.id]) {
            this.map.addPlayer(player)
            this.emitter.playerJoinedMap(this.map.constant, player.channel, player.id, player.name, player.x, player.y)
        }

    }

    private playerLeftMap(player: Player) {
        if (player && this.map.containsPlayer(player.id)) {
            this.map.removePlayer(player.id)
            this.emitter.playerLeftMap(this.map.constant, player.channel, player.id, player.name)
        }
    }

}
