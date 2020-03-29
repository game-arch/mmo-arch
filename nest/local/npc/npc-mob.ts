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

    position                                                     = {
        x: 0,
        y: 0
    }
    npcDistances: { [npcInstanceId: number]: MobDistance }       = {}
    playerDistances: { [playerInstanceId: number]: MobDistance } = {}

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

    async npcUpdate(mob: Mob) {
        if (mob.instanceId === this.config.instanceId) {
            this.position.x = mob.x
            this.position.y = mob.y
            this.validateDirections()
            for (let distances of [this.playerDistances, this.npcDistances]) {
                from(Object.keys(distances))
                    .subscribe(async id => {
                        let distance: MobDistance
                        if (distances[mob.instanceId]) {
                            distance = await this.repo.findOne(id)
                        }
                        if (distance) {
                            distance.distance = Phaser.Math.Distance.Between(this.position.x, this.position.y, distance.otherX, distance.otherY)
                            await this.repo.save(distance)
                        }
                    })
            }
        } else {
            await this.updateDistance('npc', mob)
        }
    }

    private validateDirections() {
        if (this.position.x < this.config.movingBounds.upperLeft[0]) {
            this.directions.left = false
        }
        if (this.position.x > this.config.movingBounds.bottomRight[0]) {
            this.directions.right = false
        }
        if (this.position.y < this.config.movingBounds.upperLeft[1]) {
            this.directions.up = false
        }
        if (this.position.y > this.config.movingBounds.bottomRight[1]) {
            this.directions.down = false
        }
    }

    async playerUpdate(mob: Mob) {
        await this.updateDistance('player', mob)
    }

    async updateDistance(type: 'player' | 'npc', mob: Mob) {
        let obj = (type === 'player' ? this.playerDistances : this.npcDistances)
        let distance: MobDistance
        if (obj[mob.instanceId]) {
            distance = await this.repo.findOne(obj[mob.instanceId].id)
        }
        obj[mob.instanceId] = distance || new MobDistance()
        obj[mob.instanceId].update(
            this.config.instanceId,
            type === 'npc' ? mob.instanceId : null,
            type === 'player' ? mob.instanceId : null,
            mob.x,
            mob.y,
            Phaser.Math.Distance.Between(this.position.x, this.position.y, mob.x, mob.y)
        )
        await this.repo.save(obj[mob.instanceId])
    }
}
