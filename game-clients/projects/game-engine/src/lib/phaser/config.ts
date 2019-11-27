import GameConfig = Phaser.Types.Core.GameConfig;
import RESIZE = Phaser.Scale.RESIZE;
import CANVAS = Phaser.CANVAS;
import MoveToPlugin from "phaser3-rex-plugins/plugins/moveto-plugin";

export const GAME_CONFIG: GameConfig = {
    title  : 'My Game',
    type   : CANVAS,
    scale  : {
        mode  : RESIZE,
        width : window.innerWidth,
        height: window.innerHeight
    },
    physics: {
        default: 'arcade'
    },
    plugins: {
        global: [{
            key   : 'rexMoveTo',
            plugin: MoveToPlugin,
            start : true
        }]
    }
};
