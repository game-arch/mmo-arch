import {Body, Box, Circle, World} from "p2";
import {MapConfig}                from "../config/config";
import {Player}                   from "../entities/player";
import {MapEmitter}               from "../map.emitter";
import {from, interval, Subject}  from "rxjs";
import {map, takeUntil, toArray}  from "rxjs/operators";
import {PlayerDirectionalInput}   from "../actions";


export class MapHandler {
    constant: string;
    name: string;

    world: World;

    stop$ = new Subject();

    nonPlayers: { [npcId: number]: { id: number, name: string, details: any, body: Body } }                     = {};
    players: { [characterId: number]: Player }                                                                  = {};
    resources: { [resourceId: number]: { id: number, name: string, details: any, health: number, body: Body } } = {};
    emitter                                                                                                     = new Subject();

    savePlayer = new Subject<Player>();

    constructor(public config: MapConfig) {
    }

    configure() {
        this.world = new World({islandSplit: true});
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

    start() {
        console.log('Tutorial Map Started');
        let lastCalled = null;
        interval(1000 / 60)
            .pipe(takeUntil(this.stop$))
            .subscribe(() => {
                this.world.step(new Date().valueOf(), lastCalled);
                lastCalled = new Date().valueOf();
                this.emitter.next();
            });
    }

    stop() {
        this.stop$.next();
    }


    addPlayer(player: Player) {
        this.players[player.characterId] = player;
        this.world.addBody(player.body);
        player.onStopMoving.pipe(takeUntil(player.stopListening))
              .subscribe(() => this.savePlayer.next(player));
    }

    removePlayer(player: Player) {
        if (this.players[player.characterId]) {
            this.players[player.characterId].stopListening.next();
            this.world.removeBody(this.players[player.characterId].body);
            delete this.players[player.characterId];
        }
    }

    async getAllPlayers() {
        return await from(Object.keys(this.players)).pipe(
            map(key => this.players[key].asPayload()),
            toArray()
        ).toPromise();
    }

    movePlayer(data: PlayerDirectionalInput) {
        console.log('player moved!');
        let player = this.players[data.characterId];
        if (player) {
            player.moving = {
                up   : !!data.directions.up,
                down : !!data.directions.down,
                left : !!data.directions.left,
                right: !!data.directions.right
            }
        }
    }
}
