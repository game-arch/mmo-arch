import { NpcConfig } from '../../../../shared/interfaces/npc-config'

let npcs: NpcConfig[] = []
for (let i = 1; i < 50; i++) {
    let positionX = Math.floor(Math.random() * 4000)
    let positionY = Math.floor(Math.random() * 3000)
    npcs.push({
        instanceId  : i,
        mobId       : 1,
        key         : 'Template',
        name        : 'Test Mob ' + i,
        map         : 'tutorial',
        position    : [positionX, positionY],
        path        : []
    })
}
export const TUTORIAL_NPC_DATA: NpcConfig[] = npcs
