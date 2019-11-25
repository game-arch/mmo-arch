import {Body, Box, Circle, Plane, World} from "p2";
import {MapConfig}                       from "../config/config";


export abstract class MapHandler {
    constant: string;
    name: string;

    world: World;

    protected constructor(config: MapConfig) {
        this.world = new World();
        for (let collision of config.collisions) {
            let body = new Body({mass: 0, position: [collision.x, collision.y]});
            if (collision.shape === 'circle') {
                body.addShape(new Circle({
                    radius: collision.radius
                }));
            }
            if (collision.shape === 'rectangle') {
                body.addShape(new Box({
                    width : collision.width,
                    height: collision.height
                }));
            }
            if (collision.shape === 'polygon') {
                body.fromPolygon(collision.points);
            }
            this.world.addBody(body);
        }
    }

    abstract start();

    abstract stop();


}
