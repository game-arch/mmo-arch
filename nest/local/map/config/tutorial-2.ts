import {MapConfig} from '../../../../shared/interfaces/map-config'

export const TUTORIAL_2_CONFIG: MapConfig = {
    constant  : 'tutorial-2',
    name      : 'Tutorial Island 2',
    width     : 1024,
    height    : 768,
    collisions: [
        {
            solid   : true,
            shape   : 'rectangle',
            position: [320, 500],
            radius  : 100
        },
        {
            solid   : true,
            shape   : 'rectangle',
            position: [0, 0],
            width   : 1024,
            height  : 32
        },
        {
            solid   : true,
            shape   : 'rectangle',
            position: [0, 0],
            width   : 32,
            height  : 768
        },
        {
            solid   : true,
            shape   : 'rectangle',
            position: [0, 768 - 32],
            width   : 1024,
            height  : 32
        },
        {
            solid   : true,
            shape   : 'rectangle',
            position: [1024 - 32, 0],
            width   : 32,
            height  : 768
        },
        {
            solid       : false,
            transitionId: 'tutorial-2.exit',
            transitionTo: 'tutorial.enter',
            shape       : 'rectangle',
            position    : [0, 120],
            width       : 64,
            height      : 120
        },
        {
            solid       : false,
            transitionId: 'tutorial-2.enter',
            shape       : 'rectangle',
            position    : [64, 120],
            width       : 64,
            height      : 120
        }
    ]
}
