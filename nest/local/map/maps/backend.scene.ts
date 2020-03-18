import {MapConfig}      from '../../../../shared/interfaces/map-config'
import {Player}         from '../entities/player'
import {loadCollisions} from '../../../../shared/phaser/collisions'
import {BaseScene}      from './base.scene'
import {Mob}            from '../../../../shared/phaser/mob'
import {Directions}     from '../../../../shared/phaser/directions'
import Scene = Phaser.Scene

export class BackendScene extends BaseScene implements Scene {
    constant: string
    name: string

    entities: {
        player: { [characterId: number]: Player },
        mob: { [mobId: number]: Mob }
    }
    savePlayer = (player: Player) => {
    }
    emitPlayer = (player: Player) => {
    }

    constructor(public config: MapConfig) {
        super(config)
    }

    create() {
        this.physics.world.TILE_BIAS = 40
        this.collisionGroups         = loadCollisions(this.config, this)
    }


    addPlayer(player: Player) {
        this.addEntity('player', player, player.id)
        player.sprite.onVelocityChange = () => this.onPlayerVelocityChange(player)
        player.sprite.onStopMoving     = () => this.onPlayerStopMoving(player)
    }

    onPlayerVelocityChange(player) {
        this.emitPlayer(player)
    }

    onPlayerStopMoving(player) {
        this.savePlayer(player)
    }

    removePlayer(player: Player) {
        if (player) {
            this.removeEntity('player', player.id)
        }
    }

    movePlayer(characterId: number, directions: Directions) {
        const player = this.entities.player[characterId]
        if (player) {
            player.sprite.moving = {
                up   : !!directions.up,
                down : !!directions.down,
                left : !!directions.left,
                right: !!directions.right
            }
        }
    }
}
