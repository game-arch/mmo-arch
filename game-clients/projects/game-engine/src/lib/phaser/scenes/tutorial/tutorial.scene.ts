import Scene = Phaser.Scene;
import {Location}                          from "@angular/common";
import {CharacterOffline, CharacterOnline} from "../../../../../../../../game-servers/lib/actions";
import {ConnectionManager}                 from "../../../../../../connection/src/lib/connection-manager";
import {fromEvent}                         from "rxjs";
import {takeUntil}                         from "rxjs/operators";
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
        fromEvent(this.connection.world.socket, CharacterOnline.event)
            .pipe(takeUntil(fromEvent(this.game.events, 'game.scene')))
            .pipe(takeUntil(fromEvent(this.game.events, 'destroy')))
            .subscribe(data => {
                console.log('character online', data);
            });

        fromEvent(this.connection.world.socket, CharacterOffline.event)
            .pipe(takeUntil(fromEvent(this.game.events, 'game.scene')))
            .pipe(takeUntil(fromEvent(this.game.events, 'destroy')))
            .subscribe(data => {
                console.log('character offline', data);
            });

        loadCollisions(TUTORIAL_CONFIG, this);
    }

    update(time: number, delta: number): void {
    }
}
