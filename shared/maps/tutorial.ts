import { MapConfig } from '../interfaces/map-config'

export const TUTORIAL_CONFIG: MapConfig = {
    constant: 'tutorial',
    name    : 'Tutorial Island',
    width   : 1024,
    height  : 768,
    layers  : {
        walls      : {
            collisions: {
                walls: [
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
                    }
                ]
            }
        },
        transitions: {
            exits    : {
                'exit': {
                    landingMap: 'tutorial-2',
                    landingId : 'enter',
                    position  : [0, 120],
                    width     : 64,
                    height    : 120
                }
            },
            entrances: {
                enter: [96, 200]
            }
        }
    }
}
