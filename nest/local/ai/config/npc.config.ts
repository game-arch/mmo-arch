import { NpcConfig } from '../npc-config'

export const NPC_CONFIGS: NpcConfig[] = [
    {
        instanceId     : 1,
        mobId          : 1,
        name           : 'Test Mob 1',
        map            : 'tutorial',
        position       : [300, 300],
        respawnInterval: 30 * 100,
        moveDistance   : 0,
        moveInterval   : 0,
        movingBounds   : [],
        path           : []
    },
    {
        instanceId     : 2,
        mobId          : 1,
        name           : 'Test Mob 2',
        map            : 'tutorial-2',
        position       : [330, 312],
        respawnInterval: 30 * 100,
        moveDistance   : 0,
        moveInterval   : 0,
        movingBounds   : [],
        path           : []
    }
]
