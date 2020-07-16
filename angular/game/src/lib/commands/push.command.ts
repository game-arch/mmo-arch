import { Push }           from '../../../../../shared/actions/movement.actions'
import { AttemptCommand } from '../../../../../shared/actions/command.actions'
import { PushSprite }     from '../../../../../shared/phaser/projectile/push.sprite'
import { MultiplayerScene }  from '../game-engine/phaser/scenes/multiplayer.scene'
import { GameEngineService } from '../game-engine/game-engine.service'
import Socket = SocketIOClient.Socket

export class PushCommand {

    static request(socket: Socket, event: Push) {
        socket.emit(AttemptCommand.type, event)
    }

    static handle(engine: GameEngineService) {
        engine.game.events.on(Push.type, (event: Push) => {
            if (engine.currentScene instanceof MultiplayerScene) {
                let player = engine.currentScene.playerSprites[event.characterId]
                if (player) {
                    new PushSprite(
                        'player',
                        event.characterId,
                        engine.currentScene,
                        player.x,
                        player.y,
                        event.actionArgs ? event.actionArgs.x || player.x : player.x,
                        event.actionArgs ? event.actionArgs.y || player.y : player.y
                    )
                }
            }
        })
    }
}
