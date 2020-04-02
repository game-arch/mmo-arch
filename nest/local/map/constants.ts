import { TUTORIAL_NPC_DATA }   from './npc/tutorial.npc'
import { TUTORIAL_2_NPC_DATA } from './npc/tutorial-2.npc'
import { MAPS }                from './config'

export class MapConstants {
    static readonly MAP      = process.env.MAP || null
    static readonly CAPACITY = 50
    static readonly CHANNEL  = process.env.MAP ? Number(process.env.MAP_INSTANCE_ID || '0') + (Number(process.env.NODE_APP_INSTANCE || '0') + 1) : null
    static readonly MAPS     = MAPS
    static readonly NPC      = {
        tutorial    : TUTORIAL_NPC_DATA,
        'tutorial-2': TUTORIAL_2_NPC_DATA
    }
}
