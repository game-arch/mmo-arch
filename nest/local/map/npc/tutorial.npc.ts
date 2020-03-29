import { NpcConfig } from '../../../../shared/interfaces/npc-config'

export const TUTORIAL_NPC_DATA: NpcConfig[] = [
    {
        instanceId  : 1,
        mobId       : 1,
        name        : 'Test Mob 1',
        map         : 'tutorial',
        position    : [300, 300],
        moveInterval: 10000,
        movingBounds: { upperLeft: [100, 100], bottomRight: [600, 600] },
        path        : []
    }
]
