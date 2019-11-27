import Scene = Phaser.Scene;
import {Location}            from "@angular/common";
import {ConnectionManager}   from "../../../../../../connection/src/lib/connection-manager";
import {TUTORIAL_CONFIG}     from "../../../../../../../../game-servers/src/world/map/config/tutorial";
import {loadCollisions}      from "../collisions";
import {
    AllPlayers,
    PlayerDirectionalInput,
    PlayerEnteredMap,
    PlayerLeftMap
}                            from "../../../../../../../../game-servers/src/world/map/actions";
import {Player}              from "../../entities/player";
import {from, fromEvent}     from "rxjs";
import {mergeMap, takeUntil} from "rxjs/operators";
import {EventEmitter}        from "@angular/core";
import Vector2 = Phaser.Math.Vector2;

export class TutorialScene extends Scene {

    directionMap                                = {
        s: 'down',
        w: 'up',
        a: 'left',
        d: 'right'
    };
    directions                                  = {
        up    : false,
        down  : false,
        right : false,
        bottom: false
    };
    players: { [charaacterId: number]: Player } = {};

    self: Player;

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


    create() {
        let world = this.connection.world;
        loadCollisions(TUTORIAL_CONFIG, this);
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
            this.players[data.characterId].graphics.destroy(true);
            delete this.players[data.characterId];
        }
    }

    private addOrUpdatePlayer(data: { characterId: number, x: number, y: number, moving?: { up: boolean, down: boolean, left: boolean, right: boolean } }) {
        let player = this.players[data.characterId];
        if (!player) {
            this.players[data.characterId] = new Player(this, data.x + 16, data.y + 16);
            player                         = this.players[data.characterId];
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
