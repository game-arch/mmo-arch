import { MapConfig } from '../interfaces/map-config'

export const TUTORIAL_CONFIG: MapConfig = {
    constant: 'tutorial',
    name    : 'Tutorial Island',
    width   : 4000,
    height  : 3000,
    layers  : {
        floors     : {
            collisions: {
                floor: [{
                    solid   : false,
                    shape   : 'rectangle',
                    color   : 0x00aa55,
                    position: [0, 0],
                    width   : 4000,
                    height  : 3000
                }]
            }
        },
        walls      : {
            collisions: {
                walls: [
                    {
                        solid   : true,
                        shape   : 'rectangle',
                        color   : 0x888888,
                        position: [2000, 500],
                        width   : 100,
                        height  : 100
                    }
                ]
            }
        },
        transitions: {
            exits    : {
                'exit': {
                    landingMap: 'tutorial-2',
                    landingId : 'enter',
                    position  : [64, 120],
                    width     : 32,
                    height    : 32
                }
            },
            entrances: {
                enter: [80, 136]
            }
        }
    }
}
