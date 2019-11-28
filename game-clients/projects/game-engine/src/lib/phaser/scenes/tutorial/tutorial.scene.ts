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
import {Mob}                 from "../../../../../../../../game-servers/src/world/map/phaser/mob";
import {BaseScene}           from "../../../../../../../../game-servers/src/world/map/maps/base.scene";
import {loadCollisions}      from "../../../../../../../../game-servers/src/world/map/phaser/collisions";
import Scene = Phaser.Scene;

export class TutorialScene extends BaseScene implements Scene {

    directionMap = {
        s: 'down',
        w: 'up',
        a: 'left',
        d: 'right'
    };
    directions   = {
        up    : false,
        down  : false,
        right : false,
        bottom: false
    };

    self: Mob;

    destroyed = new EventEmitter();

    constructor(private connection: ConnectionManager) {
        super(TUTORIAL_CONFIG);
    }


    update(time: number, delta: number) {
    }

    create() {
        super.create();
        let world = this.connection.world;
        this.game.events.once('game.scene', () => this.destroyed.emit());
        this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
            if (this.directionMap.hasOwnProperty(event.key)) {
                event.stopPropagation();
                event.stopImmediatePropagation();
                if (!this.directions[this.directionMap[event.key]]) {
                    this.directions[this.directionMap[event.key]] = true;
                    this.connection.world.socket.emit(PlayerDirectionalInput.event, {directions: this.directions});
                }
            }
        });
        this.input.keyboard.on('keyup', (event: KeyboardEvent) => {
            if (this.directionMap.hasOwnProperty(event.key)) {
                event.stopPropagation();
                event.stopImmediatePropagation();
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
                if (this.entities.player[data.characterId]) {
                    this.entities.player[data.characterId].moving = data.directions;
                }
            });
    }

    private removePlayer(data: PlayerLeftMap) {
        this.removeEntity('player', data.characterId);
    }

    private addOrUpdatePlayer(data: { characterId: number, x: number, y: number, moving?: { up: boolean, down: boolean, left: boolean, right: boolean } }) {
        let player = this.entities.player[data.characterId];
        if (!player) {
            player = this.createPlayer(data);
        }
        player.sprite.body.reset(data.x + 16, data.y + 16);
        if (data.moving) {
            player.moving = data.moving;
        }
    }

    private createPlayer(data: { characterId: number; x: number; y: number; moving?: { up: boolean; down: boolean; left: boolean; right: boolean } }) {
        let player = new Mob();
        this.addEntity('player', player, data.characterId);
        player.sprite.body.reset(data.x + 16, data.y + 16);
        if (this.connection.world.selectedCharacter.id === data.characterId) {
            this.setSelf(player);
        }
        return player;
    }

    private setSelf(player) {
        this.self = player;
        this.cameras.main.startFollow(player.sprite.body, true, 0.05, 0.05);
    }
}
