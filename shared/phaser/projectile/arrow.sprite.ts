import Body = Phaser.Physics.Arcade.Body
import Scene = Phaser.Scene
import { ProjectileSprite, ProjectileConfig } from './projectile.sprite'
import { MobSprite }                          from '../mob-sprite'

export class ArrowSprite extends ProjectileSprite {
    body: Body

    constructor(public originatorType: 'player' | 'npc', public instanceId: number, scene: Scene, x, y, destinationX, destinationY) {
        super(<ProjectileConfig>{
            originatorType: originatorType,
            originator    : instanceId,
            scene,
            duration      : 1000,
            speed         : 5,
            position      : [x, y],
            growTo        : 1.1,
            type          : 'bullet',
            key           : 'rain',
            destination   : [destinationX, destinationY]
        })
    }

    onHit = (target: MobSprite) => {
        if (this.hasHitSelf(target)) {
            return
        }
        this.onTargetHit(target)
    }

    private onTargetHit(target: MobSprite) {
        if (!this.targets.includes(target)) {
            this.targets.push(target)
        }
        this.destroy()
    }


    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
    }
}
