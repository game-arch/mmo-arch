import {MapConfig} from "./config";

export const TUTORIAL_CONFIG: MapConfig = {
    name      : "Tutorial",
    width     : 1000,
    height    : 1000,
    collisions: [
        {
            shape   : 'polygon',
            position: [600, 320],
            points  : [
                [-5, -5],
                [0, 5],
                [2, 10],
                [0, -8]
            ]
        },
        {
            shape   : 'rectangle',
            position: [0, 0],
            width   : 1000,
            height  : 32
        },
        {
            shape   : 'rectangle',
            position: [0, 0],
            width   : 32,
            height  : 1000
        },
        {
            shape   : 'rectangle',
            position: [0, 968],
            width   : 1000,
            height  : 32
        },
        {
            shape   : 'rectangle',
            position: [968, 0],
            width   : 32,
            height  : 1000
        }
    ]
};
