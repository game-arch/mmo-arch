import {MapConfig} from "./config";

export const TUTORIAL_CONFIG: MapConfig = {
    name      : "Tutorial",
    width     : 1024,
    height    : 768,
    collisions: [
        {
            shape   : 'polygon',
            position: [600, 320],
            points  : [
                [-50, -50],
                [0, 150],
                [20, 100],
                [0, -80]
            ]
        },
        {
            shape   : 'rectangle',
            position: [0, 0],
            width   : 1024,
            height  : 32
        },
        {
            shape   : 'rectangle',
            position: [0, 0],
            width   : 32,
            height  : 768
        },
        {
            shape   : 'rectangle',
            position: [0, 768 - 32],
            width   : 1024,
            height  : 32
        },
        {
            shape   : 'rectangle',
            position: [1024 - 32, 0],
            width   : 32,
            height  : 768
        }
    ]
};
