import { PreloadScene } from './scenes/preload/preload.scene'
import GameConfig = Phaser.Types.Core.GameConfig
import RESIZE = Phaser.Scale.RESIZE
import CANVAS = Phaser.CANVAS

export const GAME_CONFIG: GameConfig = {
    title          : 'My Game',
    type           : CANVAS,
    backgroundColor: '#555',
    scale          : {
        mode  : RESIZE,
        width : window.innerWidth,
        height: window.innerHeight,
    },
    scene          : [PreloadScene],
    physics        : {
        default: 'arcade',
        arcade : {
            debug: true,
        },
    },
}
