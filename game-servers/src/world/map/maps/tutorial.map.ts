import {MapHandler}        from "./map.handler";
import {Injectable}        from "@nestjs/common";
import {TUTORIAL_CONFIG}   from "../config/tutorial";
import {interval, Subject} from "rxjs";
import {takeUntil}         from "rxjs/operators";
import {Body}              from "p2";

@Injectable()
export class TutorialMap extends MapHandler {

    constant: string = 'tutorial';
    name: string     = 'Tutorial Island';

    stop$ = new Subject();

    nonPlayers: { [npcId: number]: { id: number, name: string, details: any, body: Body } }                     = {};
    players: { [characterId: number]: { id: number, name: string, details: any, body: Body } }                  = {};
    resources: { [resourceId: number]: { id: number, name: string, details: any, health: number, body: Body } } = {};


    constructor() {
        super(TUTORIAL_CONFIG);
    }

    start() {
        console.log('Tutorial Map Started');
        let lastCalled = null;
        interval(1000 / 60)
            .pipe(takeUntil(this.stop$))
            .subscribe(() => {
                this.world.step(new Date().valueOf(), lastCalled);
                lastCalled = new Date().valueOf();
            });
    }

    stop() {
        this.stop$.next();
    }

}
