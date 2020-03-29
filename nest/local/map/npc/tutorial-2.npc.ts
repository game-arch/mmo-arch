import { NpcConfig } from '../../../../shared/interfaces/npc-config'

export const TUTORIAL_2_NPC_DATA: NpcConfig[] = [
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
