import { NpcConfig }           from '../../../shared/interfaces/npc-config'
import { Observable, Subject } from 'rxjs'
import { filter, takeUntil }   from 'rxjs/operators'
import { Directions }          from '../../../shared/phaser/directions'
import { Mob }                 from '../../../shared/phaser/mob'
import { Repository }          from 'typeorm'
import { Distance }            from './entities/distance'

export class DistanceCalculator {
    stop = new Subject()

    directions: Directions = { down: false, left: false, right: false, up: false }

    position                                                  = {
        x: 0,
        y: 0
    }
    npcDistances: { [npcInstanceId: number]: Distance }       = {}
    playerDistances: { [playerInstanceId: number]: Distance } = {}

    constructor(private config: NpcConfig, private repo: Repository<Distance>) {
        this.position.x = config.position[0]
        this.position.y = config.position[1]
    }

    start(serverStop: Subject<any>, npcUpdate: Observable<Mob>, playerUpdate: Observable<Mob>, playerChangedMap: Observable<number>) {
        npcUpdate.pipe(takeUntil(this.stop), takeUntil(serverStop))
                 .pipe(filter(mob => mob.map === this.config.map))
                 .subscribe(mob => this.npcUpdate(mob))
        playerUpdate.pipe(takeUntil(this.stop), takeUntil(serverStop))
                    .pipe(filter(mob => mob.map === this.config.map))
                    .subscribe(mob => this.playerUpdate(mob))
    }

    async npcUpdate(mob: Mob) {
        if (mob.instanceId === this.config.instanceId) {
            this.position.x = mob.x
            this.position.y = mob.y
            let distances   = await this.repo.find({ instanceId: mob.instanceId })
            if (distances) {
                for (let distance of distances) {
                    distance.distance = Phaser.Math.Distance.Between(this.position.x, this.position.y, distance.otherX, distance.otherY)
                    await this.repo.save(distance)
                }
            }
        } else {
            await this.updateDistance('npc', mob)
        }
    }


    async playerUpdate(mob: Mob) {
        await this.updateDistance('player', mob)
    }

    async updateDistance(type: 'player' | 'npc', mob: Mob) {
        let distance = await this.repo.findOne({
            instanceId: this.config.instanceId,
            otherType : type,
            otherId   : mob.instanceId
        })
        distance     = distance || new Distance()
        distance.update(
            this.config.instanceId,
            type,
            mob.instanceId,
            mob.x,
            mob.y,
            Phaser.Math.Distance.Between(this.position.x, this.position.y, mob.x, mob.y)
        )
        await this.repo.save(distance)
    }
}
