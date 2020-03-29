import { NpcConfig }                 from './npc-config'
import { from, Observable, Subject } from 'rxjs'
import { filter, takeUntil }         from 'rxjs/operators'
import { Directions }                from '../../../shared/phaser/directions'
import { Mob }                       from '../../../shared/phaser/mob'
import { Repository }                from 'typeorm'
import { MobDistance }               from './entities/mob-distance'

export class NpcMob {
    stop = new Subject()

    directions: Directions = { down: false, left: false, right: false, up: false }

    position = {
        x: 0,
        y: 0
    }

    distances: { [playerInstanceId: number]: MobDistance } = {}

    constructor(private config: NpcConfig, private repo: Repository<MobDistance>) {
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
            from(Object.keys(this.distances))
                .subscribe(async id => {
                    let distance: MobDistance
                    if (this.distances[mob.instanceId]) {
                        distance = await this.repo.findOne(id)
                    }
                    if (distance) {
                        distance.distance = Phaser.Math.Distance.Between(this.position.x, this.position.y, distance.otherX, distance.otherY)
                        await this.repo.save(distance)
                    }
                })
        }
    }

    async playerUpdate(mob: Mob) {
        let distance: MobDistance
        if (this.distances[mob.instanceId]) {
            distance = await this.repo.findOne(this.distances[mob.instanceId].id)
        }
        this.distances[mob.instanceId] = distance || new MobDistance()
        this.distances[mob.instanceId].update(
            this.config.instanceId,
            null,
            mob.instanceId,
            mob.x,
            mob.y,
            Phaser.Math.Distance.Between(this.position.x, this.position.y, mob.x, mob.y)
        )
        await this.repo.save(this.distances[mob.instanceId])
    }
}
