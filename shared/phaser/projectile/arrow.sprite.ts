import Body = Phaser.Physics.Arcade.Body
import Scene = Phaser.Scene
import { ProjectileConfig, ProjectileSprite } from './projectile.sprite'

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
            destination   : [destinationX, destinationY],
            destroyOnTarget: true
        })
    }
}
