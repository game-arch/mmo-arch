import { BaseScene }                             from "../../../../../../../../server/services/local/map/maps/base.scene";
import { Mob }                                   from "../../../../../../../../server/lib/phaser/mob";
import { MapConfig }                             from "../../../../../../../../server/services/local/map/config/config";
import { PlayerDirectionalInput, PlayerLeftMap } from "../../../../../../../../server/services/local/map/actions";
import { ConnectionManager }                     from "../../../connection/connection-manager";
import Scene = Phaser.Scene;

export class MultiplayerScene extends BaseScene implements Scene {
    self: Mob;
    directionMap = {
        s: "down",
        w: "up",
        a: "left",
        d: "right"
    };
    directions   = {
        up   : false,
        down : false,
        right: false,
        left : false
    };

    constructor(protected manager: ConnectionManager, config: MapConfig) {
        super(config);
    }

    get connection() {
        return this.manager.world;
    }

    toggleDirection(event: KeyboardEvent, status: boolean) {
        if (this.directionMap.hasOwnProperty(event.key)) {
            event.stopImmediatePropagation();
            let direction = this.directionMap[event.key];
            if (this.directions[direction] !== status) {
                this.directions[direction] = status;
                // this.self.moving = this.directions;
                this.sendDirectionalInput();
            }
        }
    }

    sendDirectionalInput() {
        this.connection.socket.emit(PlayerDirectionalInput.event, {
            directions: this.directions
        });
    }

    removePlayer(data: PlayerLeftMap) {
        this.removeEntity("player", data.characterId);
    }

    addOrUpdatePlayer(data: {
        id: number
        name: string
        x: number
        y: number
        moving?: { up: boolean; down: boolean; left: boolean; right: boolean }
    }) {
        let player = this.entities.player[data.id];
        if (!player) {
            player = this.createPlayer(data);
        }
        player.sprite.setPosition(data.x, data.y);
        if (data.moving) {
            player.moving = data.moving;
        }
    }

    createPlayer(data: {
        id: number
        name: string
        x: number
        y: number
        moving?: { up: boolean; down: boolean; left: boolean; right: boolean }
    }) {
        let player = new Mob(data.name);
        this.addEntity("player", player, data.id);
        if (this.connection.selectedCharacter.id === data.id) {
            this.setSelf(player);
        }
        return player;
    }

    setSelf(player) {
        this.self = player;
        this.cameras.main.startFollow(player.sprite.body, true, 0.05, 0.05);
    }

    destroy() {
        this.directions = {
            up   : false,
            down : false,
            right: false,
            left : false
        };
        this.self       = null;
        this.entities   = { player: {}, mob: {} };
    }
}
