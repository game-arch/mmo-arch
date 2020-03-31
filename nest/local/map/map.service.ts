import { Inject, Injectable } from '@nestjs/common'
import { MapConstants }       from './constants'
import { Repository }         from 'typeorm'
import { Player }             from './entities/player'
import { InjectRepository }   from '@nestjs/typeorm'
import { MapEmitter }         from './map.emitter'
import { CharacterClient }    from '../character/client/character.client'
import { Game }               from 'phaser'
import { BaseScene }          from '../../../shared/phaser/base.scene'
import { NpcConfig }          from '../../../shared/interfaces/npc-config'
import { NpcAdded }           from '../../../shared/events/map.events'

@Injectable()
export class MapService {

    phaser: Game

    constructor(
        private emitter: MapEmitter,
        private character: CharacterClient,
        @Inject(MapConstants.MAP) public map: BaseScene,
        @InjectRepository(Player) private playerRepo: Repository<Player>
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

    async attemptTransition(characterId: number) {
        if (this.map.canTransition[characterId]) {
            let { mob, landingMap, landingId } = this.map.canTransition[characterId]
            this.emitter.changedMap(landingMap, mob.id, mob.x, mob.y, landingId)
        }
    }

    async changedMaps(characterId: number, map: string, newX: number, newY: number, entrance?: string) {
        const player = await this.playerRepo.findOne(characterId)
        if (player) {
            if (map === this.map.constant) {
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

    async loggedIn(characterId: number, name: string) {
        let player = await this.playerRepo.findOne(characterId)
        if (!player && this.map.constant === 'tutorial') {
            player = this.playerRepo.create({ id: characterId, map: 'tutorial', x: 100, y: 100 })
        }
        if (player && player.map === this.map.constant) {
            player.name = name
            await this.playerRepo.save(player)
            this.playerJoinedMap(player)
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
