import {Injectable}              from '@nestjs/common'
import {AiEmitter}               from './ai.emitter'
import {TUTORIAL_NPC_CONFIG}     from "./config/tutorial.config";
import {MapClient}               from "../map/client/map.client";
import {from, interval, Subject} from "rxjs";
import {mergeMap, takeUntil}     from "rxjs/operators";

@Injectable()
export class NpcService {

    stop$ = new Subject()

    maps = {
        tutorial: TUTORIAL_NPC_CONFIG
    }

    constructor(private emitter: AiEmitter, private map: MapClient) {

    }

    listen() {
        interval(300)
            .pipe(takeUntil(this.stop$))
            .pipe(mergeMap(() => from(this.maps.tutorial)))
            .subscribe(npc => {
                // do something with each npc
            })
    }

    stop() {
        this.stop$.next()
    }
}
