import { NpcConfig } from '../../../../shared/interfaces/npc-config'

let npcs: NpcConfig[] = []
for (let i = 31; i < 60; i++) {
    npcs.push({
        instanceId  : i,
        mobId       : 1,
        name        : 'Test Mob ' + i,
        map         : 'tutorial-2',
        position    : [330 + i, 312 + i],
        moveStart   : i * 100,
        moveInterval: 10000,
        movingBounds: { upperLeft: [100, 100], bottomRight: [600, 600] },
        path        : []
    })
}
export const TUTORIAL_2_NPC_DATA: NpcConfig[] = npcs
