import { Injectable }  from '@nestjs/common'
import { AiEmitter }   from './ai.emitter'
import { NPC_CONFIGS } from './config/npc.config'
import { MapClient }   from '../map/client/map.client'
import { Subject }     from 'rxjs'
import { NpcMob }      from './npc-mob'

@Injectable()
export class AiService {

    stop$ = new Subject()

    mobs: { [mobIndex: number]: NpcMob } = {}

    npcAddedCallbacks: Function[]   = []
    npcRemovedCallbacks: Function[] = []

    constructor(private emitter: AiEmitter, private map: MapClient) {

    }

    listen() {
        this.npcAddedCallbacks = []
        for (let i = 0; i < NPC_CONFIGS.length; i++) {
            this.mobs[i] = new NpcMob(NPC_CONFIGS[i])
            this.mobs[i].start(this.stop$)
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
        this.stop$.next()
    }
}
