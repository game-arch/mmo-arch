import { Inject, Injectable }          from '@nestjs/common'
import { MapConstants }                from './constants'
import { Repository }                  from 'typeorm'
import { Player }                      from './entities/player'
import { InjectRepository }            from '@nestjs/typeorm'
import { MapEmitter }                  from './map.emitter'
import { CharacterClient }             from '../character/client/character.client'
import { Game }                        from 'phaser'
import { BaseScene }                   from '../../../shared/phaser/base.scene'
import { NpcConfig }                   from '../../../shared/interfaces/npc-config'
import { ChangeMapInstance, NpcAdded } from '../../../shared/events/map.events'
import { MapInstance }                 from './entities/map-instance'

@Injectable()
export class MapService {

    phaser: Game

    constructor(
        private emitter: MapEmitter,
        private character: CharacterClient,
        @Inject(MapConstants.MAP) public map: BaseScene,
        @InjectRepository(Player) private playerRepo: Repository<Player>,
        @InjectRepository(MapInstance) private instance: Repository<MapInstance>
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


    start() {
        for (let npc of (MapConstants.NPC[MapConstants.MAP] as NpcConfig[])) {
            let data = new NpcAdded(npc.mobId, npc.instanceId, npc.name, npc.map, npc.position[0], npc.position[1])
            this.map.addNpc(data, npc)
            this.emitter.addedNpc(data.map, data.instanceId, data.mobId, data.name, data.x, data.y)
        }
        this.map.savePlayer = async (player) => {
            this.map.players[player.id].x = player.x
            this.map.players[player.id].y = player.y
            await this.playerRepo.save(this.map.players[player.id])
        }
        this.map.emitPlayer = (player) => this.emitter.playerUpdate(this.map.constant, player.asPayload(this.map.constant))
        this.map.emitMob    = (npc) => this.emitter.npcUpdate(this.map.constant, npc.asPayload(this.map.constant))
    }

    stop() {
        this.phaser.scene.stop(this.map.constant)
    }

    async attemptTransition(characterId: number, instance?: number) {
        if (this.map.canTransition[characterId]) {
            let { mob, landingMap, landingId } = this.map.canTransition[characterId]
            let player                         = await this.playerRepo.findOne(characterId)
            let count                          = await this.playerRepo.count({
                instance: instance || player.instance,
                map     : landingMap
            })
            if (count < MapConstants.CAPACITY) {
                this.emitter.changedMap(landingMap, mob.id, mob.x, mob.y, instance || player.instance, landingId)
            } else {
                await this.sendInstanceCounts(landingMap, player)
            }
        }
    }

    private async sendInstanceCounts(landingMap: string, player: Player) {
        let instances                                               = await this.instance.find({ map: landingMap })
        let list: { instanceNumber: number, playerCount: number }[] = []
        for (let row of instances) {
            let instance = {
                instanceNumber: row.instanceNumber,
                playerCount   : await this.playerRepo.count({
                    instance: row.instanceNumber,
                    map     : landingMap
                })
            }
            list.push(instance)
        }
        this.emitter.instances(player.id, landingMap, list)
    }

    async changedMaps(characterId: number, map: string, newX: number, newY: number, instance: number, entrance?: string) {
        const player = await this.playerRepo.findOne(characterId)
        if (player) {
            if (map === this.map.constant && player.instance === MapConstants.INSTANCE_ID) {
                player.map     = map
                let transition = this.map.config.layers.transitions ? this.map.config.layers.transitions.entrances[entrance] || null : null
                if (transition) {
                    player.x = transition[0]
                    player.y = transition[1]
                } else {
                    player.x = newX
                    player.y = newY
                }
                await this.playerRepo.save(player)
                this.playerJoinedMap(player)
            } else {
                this.playerLeftMap(player)
            }
        }
    }

    async loggedIn(characterId: number, name: string, instance: number = 1) {
        let player = await this.playerRepo.findOne({ id: characterId })
        if (!player && this.map.constant === 'tutorial' && MapConstants.INSTANCE_ID === 1) {
            player = this.playerRepo.create({
                id      : characterId,
                map     : 'tutorial',
                instance: instance,
                x       : 100,
                y       : 100
            })
        }
        if (player && player.map === this.map.constant && (instance === MapConstants.INSTANCE_ID)) {
            player.name     = name
            player.instance = instance
            await this.playerRepo.save(player)
            let count = await this.instance.count({ instanceNumber: instance, map: MapConstants.MAP })
            if (count < MapConstants.CAPACITY) {
                this.playerJoinedMap(player)
            } else {
                this.sendInstanceCounts(MapConstants.MAP, player)
            }
        }
    }

    async changeInstance(data: ChangeMapInstance) {
        const player = await this.playerRepo.findOne({ id: data.characterId, map: MapConstants.MAP })
        if (player) {
            let count = await this.instance.count({ instanceNumber: data.instanceNumber, map: MapConstants.MAP })
            if (count < MapConstants.CAPACITY) {
                if (MapConstants.INSTANCE_ID === data.instanceNumber) {
                    this.playerJoinedMap(player)
                } else if (MapConstants.INSTANCE_ID === player.instance) {
                    player.instance = data.instanceNumber
                    await this.playerRepo.save(player)
                    this.playerLeftMap(player)
                }
            } else {
                this.sendInstanceCounts(MapConstants.MAP, player)
            }
        }
    }

    async loggedOut(characterId: number) {
        const player = await this.playerRepo.findOne(characterId)
        if (player && player.map === this.map.constant) {
            if (this.map.players[player.id]) {
                await this.playerRepo.save(this.map.players[player.id] as Player)
                this.playerLeftMap(this.map.players[player.id] as Player)
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
            this.emitter.playerJoinedMap(this.map.constant, player.id, player.name, player.x, player.y)
        }
    }

    private playerLeftMap(player: Player) {
        if (player && this.map.containsPlayer(player.id)) {
            this.map.removePlayer(player.id)
            this.emitter.playerLeftMap(this.map.constant, player.id, player.name)
        }
    }

}
