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
                    landingMap: 'tutorial-2',
                    landingId : 'enter',
                    position  : [64, 120],
                    width     : 32,
                    height    : 32
                }
            },
            entrances: {
                enter: [96, 200]
            }
        }
    }
}
