import {Body, Box, Circle, World} from "p2";
import {MapConfig}                from "../config/config";
import {Player}                   from "../entities/player";
import {MapEmitter}               from "../map.emitter";


export abstract class MapHandler {
    constant: string;
    name: string;

    world: World;

    nonPlayers: { [npcId: number]: { id: number, name: string, details: any, body: Body } }                     = {};
    players: { [characterId: number]: Player }                                                                  = {};
    resources: { [resourceId: number]: { id: number, name: string, details: any, health: number, body: Body } } = {};

    protected constructor(public config: MapConfig) {
    }

    configure() {
        this.world = new World();
        for (let collision of this.config.collisions) {
            let body = new Body({mass: collision.mass || 0, position: collision.position});
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
            if (Boolean(collision.transitionTo)) {
                body.on('beginContact', (...args) => {
                   console.log('collision!', args);
                });
            }
            this.world.addBody(body);
        }
    }

    abstract start();

    abstract stop();


    addPlayer(player: Player) {
        this.world.addBody(player.body);
        this.players[player.characterId] = player;

    }

    removePlayer(player: Player) {
        this.world.removeBody(this.players[player.characterId].body);
        delete this.players[player.characterId];
    }
}
