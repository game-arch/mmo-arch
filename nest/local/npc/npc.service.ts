import { Injectable }                   from '@nestjs/common'
import { NpcEmitter }                   from './npc.emitter'
import { NPC_CONFIGS }                  from './config/npc.config'
import { MapClient }                    from '../map/client/map.client'
import { Subject }                      from 'rxjs'
import { NpcMob }                       from './npc-mob'
import { Mob }                          from '../../../shared/phaser/mob'
import { Repository } from 'typeorm'
import { MobDistance }                  from './entities/mob-distance'
import { InjectRepository }             from '@nestjs/typeorm'

@Injectable()
export class NpcService {

    stop$ = new Subject()

    mobs: { [mobIndex: number]: NpcMob } = {}

    npcAddedCallbacks: Function[]   = []
    npcRemovedCallbacks: Function[] = []

    onNpcUpdate    = new Subject<Mob>()
    onPlayerUpdate = new Subject<Mob>()
    onPlayerChangedMap = new Subject<number>()

    constructor(private emitter: NpcEmitter, private map: MapClient, @InjectRepository(MobDistance) private repo: Repository<MobDistance>) {

    }

    start() {
        this.npcAddedCallbacks = []
        for (let i = 0; i < NPC_CONFIGS.length; i++) {
            this.mobs[i] = new NpcMob(NPC_CONFIGS[i], this.repo)
            this.mobs[i].start(this.stop$, this.onNpcUpdate, this.onPlayerUpdate, this.onPlayerChangedMap)
            this.npcAddedCallbacks.push((map) => {
                if (map === NPC_CONFIGS[i].map) {
                    this.map.npcAdded(
                        NPC_CONFIGS[i].instanceId,
                        NPC_CONFIGS[i].mobId,
                        NPC_CONFIGS[i].name,
                        NPC_CONFIGS[i].map,
                        NPC_CONFIGS[i].position[0],
                        NPC_CONFIGS[i].position[1]
                    )
                }
            })
            this.npcRemovedCallbacks.push((map) => {
                if (this.mobs[i]) {
                    this.mobs[i].stop.next()
                }
                this.map.npcRemoved(
                    NPC_CONFIGS[i].instanceId,
                    NPC_CONFIGS[i].map
                )
            })
            this.map.npcAdded(
                NPC_CONFIGS[i].instanceId,
                NPC_CONFIGS[i].mobId,
                NPC_CONFIGS[i].name,
                NPC_CONFIGS[i].map,
                NPC_CONFIGS[i].position[0],
                NPC_CONFIGS[i].position[1]
            )
        }
    }

    stop() {
        for (let callback of this.npcRemovedCallbacks) {
            callback()
        }
        this.npcAddedCallbacks   = []
        this.npcRemovedCallbacks = []
        this.mobs                = {}
        this.stop$.next()
    }
}
