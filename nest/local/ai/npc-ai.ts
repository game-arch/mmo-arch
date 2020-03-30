import { NpcConfig }                     from '../../../shared/interfaces/npc-config'
import { interval, Observable, Subject } from 'rxjs'
import { Directions }                    from '../../../shared/phaser/directions'
import { first, takeUntil }              from 'rxjs/operators'
import { PlayerChangedMap }              from '../../../shared/events/map.events'
import { MapClient }                     from '../map/client/map.client'

export class NpcAI {
    stop = new Subject()

    directions: Directions = { down: false, left: false, right: false, up: false }

    position = {
        x: 0,
        y: 0
    }

    constructor(private config: NpcConfig, private map: MapClient) {
        this.position.x = config.position[0]
        this.position.y = config.position[1]
    }

    start(tick: Observable<number>, onPlayerChangedMap: Observable<PlayerChangedMap>) {
        tick
            .pipe(takeUntil(this.stop))
            .subscribe(async (num) => await this.update(num))
        onPlayerChangedMap
            .pipe(takeUntil(this.stop))
            .subscribe((data) => {
            })
        interval(this.config.moveStart).pipe(first())
                                       .subscribe(() => this.shouldMove = true)
    }

    walkTick      = 0
    directionList = ['down', 'right', 'up', 'left']
    lastDirection = 0
    shouldMove    = false

    async update(num: number) {
        if (this.shouldMove) {
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

    getRandomDirection() {
        let direction = Math.floor(Math.random() * 4)
        if (this.lastDirection === direction) {
            return this.getRandomDirection()
        }
        this.lastDirection = direction
        return direction
    }

}
