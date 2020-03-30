import { NpcConfig } from '../../../../shared/interfaces/npc-config'

let npcs: NpcConfig[] = []
for (let i = 1; i < 30; i++) {
    npcs.push({
        instanceId  : i,
        mobId       : 1,
        name        : 'Test Mob ' + i,
        map         : 'tutorial',
        position    : [400 + i, 400 + i],
        moveStart   : i * 100,
        moveInterval: 10000,
        movingBounds: { upperLeft: [0, 0], bottomRight: [1024, 768] },
        path        : []
    })
}
export const TUTORIAL_NPC_DATA: NpcConfig[] = npcs
