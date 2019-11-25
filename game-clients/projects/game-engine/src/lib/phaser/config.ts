import GameConfig = Phaser.Types.Core.GameConfig;
import AUTO = Phaser.AUTO;
import RESIZE = Phaser.Scale.RESIZE;

export const config: GameConfig = {
    title: 'My Game',
    type : AUTO,
    scale: {
        mode  : RESIZE,
        width : window.innerWidth,
        height: window.innerHeight
    },
    physics: {
        default:
    }
};
