import { MapConfig } from '../interfaces/map-config'

export const TUTORIAL_2_CONFIG: MapConfig = {
    constant: 'tutorial-2',
    name    : 'Tutorial Island 2',
    width   : 1024,
    height  : 768,
    layers  : {
        walls      : {
            collisions: {
                walls: [
                    {
                        solid   : true,
                        shape   : 'rectangle',
                        color   : 0x00aa55,
                        position: [0, 0],
                        width   : 1024,
                        height  : 768
                    }
                ]
            }
        },
        transitions: {
            exits    : {
                'exit': {
                    landingMap: 'tutorial',
                    landingId : 'enter',
                    position  : [1024 - 64, 120],
                    width     : 32,
                    height    : 32
                }
            },
            entrances: {
                enter: [1024 - 48, 136]
            }
        }
    }
}
