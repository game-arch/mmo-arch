import { NpcConfig }           from './npc-config'
import { Observable, Subject } from 'rxjs'
import { filter, takeUntil, tap }   from 'rxjs/operators'
import { Directions }          from '../../../shared/phaser/directions'
import { Mob }                 from '../../../shared/phaser/mob'

export class NpcMob {
    stop = new Subject()

    directions: Directions = { down: false, left: false, right: false, up: false }


    position = {
        x: 0,
        y: 0
    }

    constructor(private config: NpcConfig) {
        this.position.x = config.position[0]
        this.position.y = config.position[1]
    }

    start(serverStop: Subject<any>, npcUpdate: Observable<Mob>, playerUpdate: Observable<Mob>) {
        npcUpdate.pipe(takeUntil(this.stop), takeUntil(serverStop))
                 .pipe(filter(mob => mob.map === this.config.map))
                 .subscribe(mob => this.npcUpdate(mob))
        playerUpdate.pipe(takeUntil(this.stop), takeUntil(serverStop))
                    .pipe(filter(mob => mob.map === this.config.map))
                    .subscribe(mob => this.playerUpdate(mob))
    }

    update() {

    }

    npcUpdate(mob: Mob) {
        if (mob.instanceId === this.config.instanceId) {
            this.position.x = mob.x
            this.position.y = mob.y
        }
    }

    playerUpdate(mob: Mob) {
        console.log('Player Update for', this.config.name)
        console.log('The player', mob.name, 'has moved. Do something,', this.config.name)
        console.log('The player,', mob.name, 'is', Phaser.Math.Distance.Between(this.position.x, this.position.y, mob.x, mob.y), 'units away')
    }
}
