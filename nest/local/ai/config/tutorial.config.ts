import {NpcTypes} from "../../../../shared/types/npc.types";
import {Npc}      from "../../../../shared/interfaces/npc";

export const TUTORIAL_NPC_CONFIG: Npc[] = [
    {
        id      : 1,
        name    : 'Test Mob',
        types   : [NpcTypes.MOVABLE],
        alive   : true,
        respawn : 5 * 1000,
        position: {
            x: 100,
            y: 100
        },
        spawn   : {
            x: 100,
            y: 100
        },
        path    : [
            {
                x: 100,
                y: 100
            },
            {
                x: 200,
                y: 100
            },
            {
                x: 200,
                y: 200
            },
            {
                x: 100,
                y: 200
            }
        ],
        effects : []
    }
]
