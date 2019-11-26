import Scene = Phaser.Scene;
import {Location}                          from "@angular/common";
import {ConnectionManager}                 from "../../../../../../connection/src/lib/connection-manager";
import {TUTORIAL_CONFIG}                   from "../../../../../../../../game-servers/src/world/map/config/tutorial";
import {loadCollisions}                    from "../collisions";

export class TutorialScene extends Scene {

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
        loadCollisions(TUTORIAL_CONFIG, this);
    }

    update(time: number, delta: number): void {
    }
}
