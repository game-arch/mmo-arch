import { MapConfig }         from '../interfaces/map-config'
import { MapShape }          from '../interfaces/map-shape'
import { MapCollisionLayer } from './map-collision.layer'
import Scene = Phaser.Scene
import Body = Phaser.Physics.Arcade.Body

export async function loadCollisions(config: MapConfig, scene: Scene): Promise<{ [id: string]: MapCollisionLayer }> {
    scene.physics.world.setBounds(0, 0, config.width, config.height)
    let layers: { [id: string]: MapCollisionLayer } = {
        mobs: new MapCollisionLayer({
            players: scene.physics.add.group([], {
                visible      : true,
                frameQuantity: 30
            }),
            npcs   : scene.physics.add.group([], {
                visible      : true,
                frameQuantity: 30
            })
        })
    }

    function addShapeToScene(shape: MapShape) {
        shape.fillColor = 0xaaaaaa
        shape.setOrigin(0, 0)
        scene.physics.add.existing(shape);
        (shape.body as Body).immovable = true
    }


    for (let layer of Object.keys(config.layers)) {
        layers[layer] = new MapCollisionLayer({})
        for (let group of Object.keys(config.layers[layer].collisions || {})) {
            let collisions = []
            for (let collision of config.layers[layer].collisions[group]) {
                let shape: MapShape = scene.add.rectangle(collision.position[0], collision.position[1], collision.width, collision.height, 0x0055ff)
                if (collision.shape === 'circle') {
                    shape                  = scene.add.circle(collision.position[0], collision.position[1], collision.radius, 0x0000ff)
                    shape.body['isCircle'] = true
                    shape.body['radius']   = collision.radius + 4
                }
                shape.collision = collision
                await addShapeToScene(shape)
                collisions.push(shape)
            }
            layers[layer].collisions[group] = scene.physics.add.group(collisions, {
                visible  : true,
                immovable: true
            })
            scene.physics.add.collider(layers.mobs.players, layers[layer].collisions[group])
            scene.physics.add.collider(layers.mobs.npcs, layers[layer].collisions[group])
        }
        for (let key of Object.keys(config.layers[layer].exits || {})) {
            let transition      = config.layers[layer].exits[key]
            let shape: MapShape = scene.add.rectangle(transition.position[0], transition.position[1], transition.width, transition.height, 0x0055ff)
            await addShapeToScene(shape)
            layers[layer].exits[key] = shape
        }
    }
    return layers
}
