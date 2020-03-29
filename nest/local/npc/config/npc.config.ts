import { NpcConfig } from '../npc-config'

export const NPC_CONFIGS: NpcConfig[] = [
    {
        instanceId  : 1,
        mobId       : 1,
        name        : 'Test Mob 1',
        map         : 'tutorial',
        position    : [300, 300],
        moveInterval: 10000,
        movingBounds: { upperLeft: [100, 100], bottomRight: [600, 600] },
        path        : []
    },
    {
        instanceId  : 2,
        mobId       : 1,
        name        : 'Test Mob 2',
        map         : 'tutorial-2',
        position    : [330, 312],
        moveInterval: 10000,
        movingBounds: { upperLeft: [100, 100], bottomRight: [600, 600] },
        path        : []
    }
]
