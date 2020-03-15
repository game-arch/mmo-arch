import { MapConfig } from '../../nest/local/map/config/config'
import Scene = Phaser.Scene
import Body = Phaser.Physics.Arcade.Body
import Shape = Phaser.GameObjects.Shape

export function loadCollisions(config: MapConfig, scene: Scene) {
    scene.physics.world.setBounds(0, 0, config.width, config.height)
    let colliders = []
    let overlaps  = []

    function addCollisionShape(shape: Shape, collision) {
        if (Boolean(collision.transitionTo)) {
            shape.fillColor = 0xaaaaaa
        }
        shape.setOrigin(0, 0)
        scene.physics.add.existing(shape);
        (shape.body as Body).immovable = true
        if (collision.transitionTo) {
            overlaps.push(shape)
            return
        }
        colliders.push(shape)
    }

    for (let collision of config.collisions) {
        if (collision.shape === 'circle') {
            let shape = scene.add.circle(collision.position[0], collision.position[1], collision.radius, 0x0000ff)
            addCollisionShape(shape, collision);
            (shape.body as Body).isCircle = true;
            (shape.body as Body).radius   = collision.radius + 4
        }
        if (collision.shape === 'rectangle') {
            let shape = scene.add.rectangle(collision.position[0], collision.position[1], collision.width, collision.height, 0x0055ff)
            addCollisionShape(shape, collision)
        }
        if (collision.shape === 'polygon') {
            let shape = scene.add.polygon(collision.position[0], collision.position[1], collision.points, 0xff2200)
            addCollisionShape(shape, collision)
        }
    }
    return {
        colliders: scene.physics.add.group(colliders, {
            visible      : true,
            frameQuantity: 30,
            immovable    : true,
        }),
        overlaps : scene.physics.add.group(overlaps, {
            visible      : true,
            frameQuantity: 30,
            immovable    : true,
        }),
    }
}
