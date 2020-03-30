import { NpcConfig }           from '../../../shared/interfaces/npc-config'
import { Observable, Subject } from 'rxjs'
import { Directions }          from '../../../shared/phaser/directions'
import { takeUntil }           from 'rxjs/operators'
import { DistanceClient }      from '../distance/client/distance.client'
import { NpcDistance }         from '../../../shared/interfaces/npc-distance'
import { PlayerChangedMap }    from '../map/actions'
import { MapClient }           from '../map/client/map.client'

export class NpcAI {
    stop = new Subject()

    directions: Directions = { down: false, left: false, right: false, up: false }

    position = {
        x: 0,
        y: 0
    }

    constructor(private config: NpcConfig, private distance: DistanceClient, private map: MapClient) {
        this.position.x = config.position[0]
        this.position.y = config.position[1]
    }

    start(tick: Observable<number>, onDistanceChange: Observable<NpcDistance>, onPlayerChangedMap: Observable<PlayerChangedMap>) {
        tick
            .pipe(takeUntil(this.stop))
            .subscribe(async (num) => await this.update(num))
        onDistanceChange
            .pipe(takeUntil(this.stop))
            .subscribe(async (data) => await this.distanceUpdated(data))
        onPlayerChangedMap
            .pipe(takeUntil(this.stop))
            .subscribe((data) => {
            })
    }

    walkTick      = 0
    directionList = ['down', 'right', 'up', 'left']
    lastDirection = 0

    async update(num: number) {
        this.walkTick++
        if (this.walkTick === 10) {
            this.stopMoving()
            this.walkTick = 0
            return
        }
        if (this.walkTick === 5) {
            this.moveInARandomDirection()
        }
    }

    private moveInARandomDirection() {
        let direction = this.getRandomDirection()
        this.map.npcDirectionalInput(this.config.instanceId, this.config.map, {
            ...this.directions,
            [this.directionList[direction]]: true
        })
    }

    private stopMoving() {
        this.map.npcDirectionalInput(this.config.instanceId, this.config.map, this.directions)
    }

    async distanceUpdated(data) {

    }

    getRandomDirection() {
        let direction = Math.floor(Math.random() * 4)
        if (this.lastDirection === direction) {
            return this.getRandomDirection()
        }
        this.lastDirection = direction
        return direction
    }

}
