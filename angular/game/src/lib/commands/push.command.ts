import { Push }              from '../../../../../shared/events/actions/movement.actions'
import { AttemptCommand }    from '../../../../../shared/events/command.events'
import { PushSprite }        from '../../../../../shared/phaser/projectile/push.sprite'
import { MultiplayerScene }  from '../game-engine/phaser/scenes/multiplayer.scene'
import { GameEngineService } from '../game-engine/game-engine.service'
import Socket = SocketIOClient.Socket

export class PushCommand {

    static request(socket: Socket, event: Push) {
        socket.emit(AttemptCommand.event, event)
    }

    static handle(engine: GameEngineService) {
        engine.game.events.on(Push.event, (event: Push) => {
            if (engine.currentScene instanceof MultiplayerScene) {
                let player = engine.currentScene.playerSprites[event.characterId]
                if (player) {
                    new PushSprite(
                        engine.currentScene,
                        player.x,
                        player.y,
                        event.actionArgs.x,
                        event.actionArgs.y
                    )
                }
            }
        })
    }
}
