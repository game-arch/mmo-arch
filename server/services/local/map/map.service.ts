import { Inject, Injectable } from '@nestjs/common'
import { MapConstants }       from './constants'
import { Repository }         from 'typeorm'
import { Player }             from './entities/player'
import { InjectRepository }   from '@nestjs/typeorm'
import { MapEmitter }         from './map.emitter'
import { CharacterClient }    from '../character/client/character.client'
import { filter, takeUntil }  from 'rxjs/operators'
import { Game }               from 'phaser'
import { BackendScene }       from './maps/backend.scene'
import { MapTransition }      from './entities/map-transition'
import { Directions }         from '../../../lib/phaser/directions'

@Injectable()
export class MapService {

    phaser: Game

    constructor(
        private emitter: MapEmitter,
        private character: CharacterClient,
        @Inject(MapConstants.MAP) public map: BackendScene,
        @InjectRepository(MapTransition) private transitionRepo: Repository<MapTransition>,
        @InjectRepository(Player) private playerRepo: Repository<Player>,
    ) {

        this.phaser = new Game({
            type   : Phaser.HEADLESS,
            width  : 1024,
            height : 768,
            banner : true,
            audio  : {
                noAudio: true,
            },
            scene  : [this.map],
            physics: {
                default: 'arcade',
                arcade : {
                    gravity: { y: 0, x: 0 },
                },
            },
        })

    }


    start() {
        this.phaser.scene.start(this.map.constant)
        this.map.savePlayer
            .pipe(takeUntil(this.map.stop$))
            .pipe(filter(player => !!player))
            .subscribe(async player => {
                await this.playerRepo.save(player)
            })
        this.map.emitPlayer
            .pipe(takeUntil(this.map.stop$))
            .pipe(filter(player => !!player))
            .subscribe(async player => {
                this.emitter.playerUpdate(this.map.constant, player.asPayload())
            })
    }

    stop() {
        this.map.stop$.next()
        this.phaser.scene.stop(this.map.constant)
    }

    async changedMaps(characterId: number, map: string, newX: number, newY: number) {
        let player = await this.playerRepo.findOne({ characterId })
        if (player) {
            let lastMap = player.map + ''
            if (map === this.map.constant) {
                player.map     = map
                player.x       = newX
                player.y       = newY
                let transition = await this.transitionRepo.findOne({ map: lastMap, destinationMap: map })
                if (transition) {
                    player.x = transition.destinationX
                    player.y = transition.destinationY
                }
                await this.playerRepo.save(player)
                this.playerJoinedMap(player)
            }
            if (lastMap === this.map.constant) {
                this.playerLeftMap(player)
            }
        }
    }

    async loggedIn(characterId: number, name: string) {
        let player = await this.playerRepo.findOne({ characterId })
        if (!player && this.map.constant === 'tutorial') {
            player = this.playerRepo.create({ characterId, map: 'tutorial', x: 100, y: 100 })
        }
        if (player && player.map === this.map.constant) {
            player.name = name
            await this.playerRepo.save(player)
            this.playerJoinedMap(player)
        }
    }

    async loggedOut(characterId: number) {
        let player = await this.playerRepo.findOne({ characterId })
        if (player && player.map === this.map.constant) {
            if (this.map.entities.player[player.id]) {
                await this.playerRepo.save(this.map.entities.player[player.id])
                this.playerLeftMap(this.map.entities.player[player.id])
            }
        }

    }

    movePlayer(characterId: number, directions: Directions) {
        if (this.map.entities.player[characterId]) {
            this.map.movePlayer(characterId, directions)
        }
    }

    getPlayerPosition(characterId: number) {
        let player = this.map.entities.player[characterId]
        if (player) {
            return {
                x: player.x,
                y: player.y,
            }
        }
        return null
    }

    private playerJoinedMap(player: Player) {
        this.map.addPlayer(player)
        this.emitter.playerJoinedMap(this.map.constant, player.characterId, player.name, player.x, player.y)
    }

    private playerLeftMap(player: Player) {
        if (player) {
            this.map.removePlayer(player)
            this.emitter.playerLeftMap(this.map.constant, player.characterId, player.name)
        }
    }

}
