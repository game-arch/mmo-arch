import Sprite = Phaser.GameObjects.Sprite
import Body = Phaser.Physics.Arcade.Body
import Scene = Phaser.Scene
import { MobSprite }    from '../mob-sprite'
import { BaseScene }    from '../base.scene'
import { Physics }      from '../physics'
import { PlayerSprite } from '../player.sprite'
import { NpcSprite }    from '../npc.sprite'

export interface ProjectileConfig {
    originator: number,
    originatorType: 'player' | 'npc',
    key?: string,
    frame?: string,
    growTo?: number,
    duration: number,
    scene: Scene,
    speed: number,
    width?: number,
    height?: number,
    type: 'cone' | 'central' | 'pillar' | 'remote' | 'bullet',
    position: [number, number],
    destination: [number, number],
    destroyOnTarget?: boolean,
    destroyOnSelf?:boolean
}

export class ProjectileSprite extends Sprite {
    body: Body

    targets: MobSprite[] = []

    getScene() {
        return this.scene as BaseScene
    }

    constructor(public config: ProjectileConfig) {
        super(config.scene, config.position[0], config.position[1], config.key, config.frame)
        config.scene.add.existing(this)
        this.setSize(this.config.width || 32, this.config.height || 32)
        config.scene.physics.add.existing(this)
        this.body.immovable = true
        if (this.config.type !== 'pillar') {
            this.body.isCircle = true
        }

        this.tween({
            scale: (this.config.growTo || 1) * this.scale
        }, this.config.duration)
        this.project()
    }

    protected tween(props: { [key: string]: any }, duration = 300) {
        let movement = this.scene.tweens.add({
            targets: this,
            duration,
            props
        })
        movement.on('complete', () => {
            this.destroy()
        })
    }

    protected project() {
        if (this.x !== this.config.destination[0] || this.y !== this.config.destination[1]) {
            let velocity = Physics.velocityFromDifference(this.x, this.y, this.config.destination[0], this.config.destination[1])
            this.angle   = Physics.angleFromVelocity(velocity.x, velocity.y)
            this.body.setVelocity(velocity.x * this.config.speed, velocity.y * this.config.speed)
        }
    }

    protected hasHitSelf(target: MobSprite) {
        return ((this.config.originatorType == 'player' && target instanceof PlayerSprite)
            || (this.config.originatorType == 'npc' && target instanceof NpcSprite))
            && this.config.originator === target.id
    }


    onHit(target: MobSprite) {
        if (this.hasHitSelf(target)) {
            this.onSelfHit(target)
            return
        }
        this.onTargetHit(target)
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
        this.scene.physics.world.overlap(
            this,
            this.getScene().allMobSprites,
            (obj1: any, obj2: any) => this.onHit(obj1 instanceof MobSprite ? obj1 : obj2)
        )
    }

    disableMovement(target: PlayerSprite | NpcSprite) {
        target.tick               = 0
        target.walking            = false
        target.movementDisabledBy = this
    }

    onSelfHit(target: MobSprite) {
        if (!this.targets.includes(target)) {
            this.targets.push(target)
        }
        if (this.config.destroyOnSelf) {
            this.destroy()
        }
    }

    onTargetHit(target: MobSprite) {
        if (!this.targets.includes(target)) {
            this.targets.push(target)
        }
        if (this.config.destroyOnTarget) {
            this.destroy()
        }
    }

    destroy() {
        super.destroy(true)
        this.targets.map(mob => {
            if (mob.movementDisabledBy === this) {
                mob.body.setVelocity(0, 0)
                mob.movementDisabledBy = null
                mob.onVelocityChange()
            }
        })
        this.targets = []
    }
}
