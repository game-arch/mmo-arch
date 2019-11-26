import {MapConfig} from "../../../../../../../game-servers/src/world/map/config/config";
import Scene = Phaser.Scene;

export function loadCollisions(config: MapConfig, scene: Scene) {
    scene.physics.world.setBounds(0, 0, config.width, config.height);
    let shapes = [];
    for (let collision of config.collisions) {
        if (collision.shape === 'circle') {
            let shape = scene.add.circle(collision.position[0], collision.position[1], collision.radius, 0x0000ff);
            shape.setOrigin(0,0);
            shapes.push(shape);
        }
        if (collision.shape === 'rectangle') {
            let shape = scene.add.rectangle(collision.position[0], collision.position[1], collision.width, collision.height, 0x0055ff);
            shape.setOrigin(0,0);
            shapes.push(shape);
        }
        if (collision.shape === 'polygon') {
            let shape = scene.add.polygon(collision.position[0], collision.position[1], collision.points, 0xff2200);
            shape.setOrigin(0,0);
            shapes.push(shape);
        }
    }
    scene.physics.add.staticGroup(shapes, {
        visible      : true,
        frameQuantity: 30
    });
}
