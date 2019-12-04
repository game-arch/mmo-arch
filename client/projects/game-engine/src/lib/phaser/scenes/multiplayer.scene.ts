import {BaseScene}         from "../../../../../../../server/services/map/maps/base.scene";
import Scene = Phaser.Scene;
import {Mob}               from "../../../../../../../server/lib/phaser/mob";
import {EventEmitter}      from "@angular/core";
import {MapConfig}         from "../../../../../../../server/services/map/config/config";
import {
    AllPlayers,
    PlayerDirectionalInput,
    PlayerEnteredMap,
    PlayerLeftMap, PlayerUpdate
}                          from "../../../../../../../server/services/map/actions";
import {from}              from "rxjs";
import {ConnectionManager} from "../../../../../connection/src/lib/connection-manager";

export class MultiplayerScene extends BaseScene implements Scene {

    directionMap = {
        s: 'down',
        w: 'up',
        a: 'left',
        d: 'right'
    };
    directions   = {
        up   : false,
        down : false,
        right: false,
        left : false
    };

    self: Mob;

    destroyed = new EventEmitter();

    get connection() {
        return this.manager.world;
    }

    constructor(protected manager: ConnectionManager, config: MapConfig) {
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
        this.input.keyboard.on('keyup', (event: KeyboardEvent) => this.toggleDirection(event, false));
        this.game.events.on(PlayerEnteredMap.event, (data) => {
            console.log('Player Joined', data);
            this.addOrUpdatePlayer({...data, id: data.characterId});
        });
        this.game.events.on(PlayerLeftMap.event, (data) => {
            console.log('Player Left', data);
            this.removePlayer(data);
        });
        this.game.events.on(AllPlayers.event, players => {
            from(players)
                .subscribe((player: { id: number, x: number, y: number, moving?: { up: boolean, down: boolean, left: boolean, right: boolean } }) => this.addOrUpdatePlayer(player));
        });
        this.game.events.on(PlayerDirectionalInput.event, data => {
            if (this.entities.player[data.characterId]) {
                this.entities.player[data.characterId].moving = data.directions;
            }
        });
        this.game.events.on(PlayerUpdate.event, (data: PlayerUpdate) => {
            this.addOrUpdatePlayer(data.player);
        });
    }

    private sendDirectionalInput() {
        this.connection.socket.emit(PlayerDirectionalInput.event, {directions: this.directions});
    }

    private removePlayer(data: PlayerLeftMap) {
        this.removeEntity('player', data.characterId);
    }

    private addOrUpdatePlayer(data: { id: number, x: number, y: number, moving?: { up: boolean, down: boolean, left: boolean, right: boolean } }) {
        let player = this.entities.player[data.id];
        if (!player) {
            player = this.createPlayer(data);
        }
        player.sprite.setPosition(data.x, data.y);
        if (data.moving) {
            player.moving = data.moving;
        }
    }

    private createPlayer(data: { id: number; x: number; y: number; moving?: { up: boolean; down: boolean; left: boolean; right: boolean } }) {
        let player = new Mob();
        this.addEntity('player', player, data.id);
        if (this.connection.selectedCharacter.id === data.id) {
            this.setSelf(player);
        }
        return player;
    }

    private setSelf(player) {
        this.self = player;
        this.cameras.main.startFollow(player.sprite.body, true, 0.05, 0.05);
    }
}
