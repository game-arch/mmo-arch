import { NpcConfig } from '../../../../shared/interfaces/npc-config'

let npcs: NpcConfig[] = []
for (let i = 1; i < 100; i++) {
    let positionX = Math.floor(Math.random() * 1024)
    let positionY = Math.floor(Math.random() * 768)
    npcs.push({
        instanceId  : i,
        mobId       : 1,
        key         : 'Template',
        name        : 'Test Mob ' + i,
        map         : 'tutorial',
        position    : [positionX, positionY],
        moveStart   : i * 500,
        moveInterval: 300,
        path        : []
    })
}
export const TUTORIAL_NPC_DATA: NpcConfig[] = npcs
