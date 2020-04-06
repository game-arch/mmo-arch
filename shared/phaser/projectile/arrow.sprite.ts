import Body = Phaser.Physics.Arcade.Body
import Scene = Phaser.Scene
import { Projectile }   from './projectile'
import { MobSprite }    from '../mob-sprite'
import { PlayerSprite } from '../player.sprite'
import { NpcSprite }    from '../npc.sprite'

export class ArrowSprite extends Projectile {
    body: Body

    constructor(public originator: 'player' | 'npc', public instanceId: number, scene: Scene, x, y, destinationX, destinationY) {
        super(originator, scene, x, y, 4, destinationX, destinationY)
        if (x === destinationX && y === destinationY) {
            this.destroy()
            return
        }
        this.setTexture('rain')
        this.project()
        this.tween({
            scale: 1
        }, 1000)
    }

    onHit = (target: MobSprite) => {
        if (this.hasHitSelf(target)) {
            return
        }
        this.onTargetHit(target)
    }


    private hasHitSelf(target: MobSprite) {
        return ((this.originator == 'player' && target instanceof PlayerSprite)
            || (this.originator == 'npc' && target instanceof NpcSprite))
            && this.instanceId === target.id
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

    destroy() {
        super.destroy(true)
        this.targets = []
    }
}
