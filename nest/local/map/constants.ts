import { TUTORIAL_NPC_DATA }   from './npc/tutorial.npc'
import { TUTORIAL_2_NPC_DATA } from './npc/tutorial-2.npc'

export class MapConstants {
    static readonly MAP = process.env.MAP
    static readonly NPC = {
        tutorial    : TUTORIAL_NPC_DATA,
        'tutorial-2': TUTORIAL_2_NPC_DATA
    }
}
