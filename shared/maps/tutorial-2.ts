import { MapConfig } from '../interfaces/map-config'

export const TUTORIAL_2_CONFIG: MapConfig = {
    constant: 'tutorial-2',
    name    : 'Tutorial Island 2',
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
        transitions: {
            exits    : {
                'exit': {
                    landingMap: 'tutorial',
                    landingId : 'enter',
                    position  : [4000 - 64, 120],
                    width     : 32,
                    height    : 32
                }
            },
            entrances: {
                enter: [4000 - 48, 136]
            }
        }
    }
}
