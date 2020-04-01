import { NpcConfig } from '../../../../shared/interfaces/npc-config'

let npcs: NpcConfig[] = []
for (let i = 1; i < 50; i++) {
    let positionX = Math.floor(Math.random() * 4000)
    let positionY = Math.floor(Math.random() * 3000)
    npcs.push({
        instanceId  : i + 100,
        mobId       : 1,
        key         : 'Template',
        name        : 'Test Mob ' + (i + 100),
        map         : 'tutorial-2',
        position    : [positionX, positionY],
        path        : []
    })
}
export const TUTORIAL_2_NPC_DATA: NpcConfig[] = npcs
