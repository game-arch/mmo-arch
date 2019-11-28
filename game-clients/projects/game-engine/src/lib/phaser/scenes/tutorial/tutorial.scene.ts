import Scene = Phaser.Scene;
import {Location}            from "@angular/common";
import {ConnectionManager}   from "../../../../../../connection/src/lib/connection-manager";
import {TUTORIAL_CONFIG}     from "../../../../../../../../game-servers/src/world/map/config/tutorial";
import {
    AllPlayers,
    PlayerDirectionalInput,
    PlayerEnteredMap,
    PlayerLeftMap
}                            from "../../../../../../../../game-servers/src/world/map/actions";
import {from, fromEvent}     from "rxjs";
import {mergeMap, takeUntil} from "rxjs/operators";
import {EventEmitter}        from "@angular/core";
import {PlayerSprite}        from "../../../../../../../../game-servers/src/world/map/phaser/playerSprite";
import {loadCollisions}      from "../../../../../../../../game-servers/src/world/map/phaser/collisions";
import Group = Phaser.Physics.Arcade.Group;

export class TutorialScene extends Scene {

    directionMap                                      = {
        s: 'down',
        w: 'up',
        a: 'left',
        d: 'right'
    };
    directions                                        = {
        up    : false,
        down  : false,
        right : false,
        bottom: false
    };
    players: { [charaacterId: number]: PlayerSprite } = {};

    self: PlayerSprite;

    destroyed = new EventEmitter();

    constructor(private connection: ConnectionManager, private location: Location) {
        super({
            key: 'tutorial'
        });
    }

    preload() {

    }

    init() {

    }

    collisionGroups: { overlaps: Group, colliders: Group };

    create() {
        this.physics.world.TILE_BIAS = 40;
        let world                    = this.connection.world;
        this.collisionGroups         = loadCollisions(TUTORIAL_CONFIG, this);
        this.game.events.once('game.scene', () => this.destroyed.emit());
        this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
            if (this.directionMap.hasOwnProperty(event.key)) {
                if (!this.directions[this.directionMap[event.key]]) {
                    this.directions[this.directionMap[event.key]] = true;
                    this.connection.world.socket.emit(PlayerDirectionalInput.event, {directions: this.directions});
                }
            }
        });
        this.input.keyboard.on('keyup', (event: KeyboardEvent) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
            if (this.directionMap.hasOwnProperty(event.key)) {
                if (this.directions[this.directionMap[event.key]]) {
                    this.directions[this.directionMap[event.key]] = false;
                    this.connection.world.socket.emit(PlayerDirectionalInput.event, {directions: this.directions});
                }
            }
        });
        fromEvent(world.socket, PlayerEnteredMap.event)
            .pipe(takeUntil(this.destroyed))
            .subscribe((data: PlayerEnteredMap) => {
                console.log('Player Joined', data);
            });
        fromEvent(world.socket, PlayerLeftMap.event)
            .pipe(takeUntil(this.destroyed))
            .subscribe((data: PlayerLeftMap) => {
                console.log('Player Left', data);
                this.removePlayer(data);
            });
        fromEvent(world.socket, AllPlayers.event)
            .pipe(takeUntil(this.destroyed))
            .pipe(mergeMap((players: { characterId: number, x: number, y: number, moving?: { up: boolean, down: boolean, left: boolean, right: boolean } }[]) => from(players)))
            .subscribe(player => {
                this.addOrUpdatePlayer(player);
            });
        fromEvent(world.socket, PlayerDirectionalInput.event)
            .pipe(takeUntil(this.destroyed))
            .subscribe((data: PlayerDirectionalInput) => {
                if (this.players[data.characterId]) {
                    this.players[data.characterId].moving = data.directions;
                }
            });
    }

    update(time: number, delta: number): void {
    }

    private removePlayer(data: PlayerLeftMap) {
        if (this.players.hasOwnProperty(data.characterId)) {
            this.players[data.characterId].graphic.destroy(true);
            delete this.players[data.characterId];
        }
    }

    private addOrUpdatePlayer(data: { characterId: number, x: number, y: number, moving?: { up: boolean, down: boolean, left: boolean, right: boolean } }) {
        let player = this.players[data.characterId];
        if (!player) {
            this.players[data.characterId] = new PlayerSprite();
            player                         = this.players[data.characterId];
            player.init(this, data.x + 16, data.y + 16);
            this.physics.add.collider(player.graphic, this.collisionGroups.colliders);
            this.physics.add.overlap(player.graphic, this.collisionGroups.overlaps);
            if (this.connection.world.selectedCharacter.id === data.characterId) {
                this.self = player;
                this.cameras.main.startFollow(player.body, true, 0.05, 0.05);
            }
        }
        player.body.reset(data.x + 16, data.y + 16);
        if (data.moving) {
            player.moving = data.moving;
        }
    }
}
