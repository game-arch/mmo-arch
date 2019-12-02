import {BaseScene}       from "../../../../../../../game-servers/src/world/map/maps/base.scene";
import Scene = Phaser.Scene;
import {Mob}             from "../../../../../../../game-servers/src/world/map/phaser/mob";
import {EventEmitter}    from "@angular/core";
import {MapConfig}       from "../../../../../../../game-servers/src/world/map/config/config";
import {
    AllPlayers,
    PlayerDirectionalInput,
    PlayerEnteredMap,
    PlayerLeftMap
}                        from "../../../../../../../game-servers/src/world/map/actions";
import {from}            from "rxjs";
import {WorldConnection} from "../../../../../connection/src/lib/world-connection";

export class MultiplayerScene extends BaseScene implements Scene {

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


    constructor(protected connection: WorldConnection, config: MapConfig) {
        super(config);
    }

    toggleDirection(event: KeyboardEvent, status: boolean) {
        if (this.directionMap.hasOwnProperty(event.key)) {
            event.stopImmediatePropagation();
            let direction = this.directionMap[event.key];
            if (this.directions[direction] !== status) {
                this.directions[direction] = status;
                this.sendDirectionalInput();
            }
        }
    }

    create() {
        super.create();
        this.game.events.once('game.scene', () => this.destroyed.emit());
        this.input.keyboard.on('keydown', (event: KeyboardEvent) => this.toggleDirection(event, true));
        this.input.keyboard.on('keyup', (event: KeyboardEvent) => this.toggleDirection(event, true));
        this.game.events.on(PlayerEnteredMap.event, (data) => {
            console.log('Player Joined', data);
        });
        this.game.events.on(PlayerLeftMap.event, (data) => {
            console.log('Player Left', data);
            this.removePlayer(data);
        });
        this.game.events.on(AllPlayers.event, players => {
            from(players)
                .subscribe((player: { characterId: number, x: number, y: number, moving?: { up: boolean, down: boolean, left: boolean, right: boolean } }) => this.addOrUpdatePlayer(player));
        });
        this.game.events.on(PlayerDirectionalInput.event, data => {
            if (this.entities.player[data.characterId]) {
                this.entities.player[data.characterId].moving = data.directions;
            }
        });
    }

    private sendDirectionalInput() {
        this.connection.socket.emit(PlayerDirectionalInput.event, {directions: this.directions});
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
        if (this.connection.selectedCharacter.id === data.characterId) {
            this.setSelf(player);
        }
        return player;
    }

    private setSelf(player) {
        this.self = player;
        this.cameras.main.startFollow(player.sprite.body, true, 0.05, 0.05);
    }
}
