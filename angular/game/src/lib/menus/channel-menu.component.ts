import { Component, EventEmitter, HostBinding }                        from '@angular/core'
import { GameEngineService }                                           from '../game-engine/game-engine.service'
import { ConnectionManager }                                           from '../connection/connection-manager'
import { ChangeMapChannel, GetMapChannels, PlayerAttemptedTransition } from '../../../../../shared/events/map.events'
import { MultiplayerScene }                                            from '../game-engine/phaser/scenes/multiplayer.scene'

@Component({
    selector   : 'channel-menu',
    templateUrl: 'channel-menu.component.html',
    styleUrls  : ['channel-menu.component.scss'],
    inputs     : ['map', 'character', 'forCharacterSelection'],
    outputs    : ['selected']
})
export class ChannelMenuComponent {
    @HostBinding('class.shown')
    shown                 = true
    map: string           = ''
    character: number     = null
    forCharacterSelection = false
    destroy               = new EventEmitter()
    selected              = new EventEmitter()

    constructor(private game: GameEngineService, private connection: ConnectionManager) {
    }

    get channels() {
        return this.game.mapChannels[this.game.currentSceneKey] || []
    }

    ngOnInit() {
        this.shown = true
        let scene  = this.game.currentScene instanceof MultiplayerScene ? this.game.currentScene.name : null
        this.connection.world.socket.emit(GetMapChannels.event, new GetMapChannels(scene, this.character), (channels) => {
            console.log(channels)
            this.game.mapChannels[this.game.currentSceneKey] = channels
        })
    }

    selectChannel(channel: number) {
        this.selected.emit()
        if (this.map !== '') {
            this.connection.world.socket.emit(PlayerAttemptedTransition.event, channel, (result) => {
                console.log(result)
                if (!result.status) {
                    this.connection.world.socket.emit(GetMapChannels.event, new GetMapChannels(result.map, this.character), (channels) => {
                        this.game.mapChannels[result.map] = channels
                    })
                } else {
                    this.selected.emit(channel)
                }
            })
            return
        }
        if (!this.forCharacterSelection) {
            this.connection.world.socket.emit(ChangeMapChannel.event, channel)
        }
        this.selected.emit(channel)
    }

    ngOnDestroy() {
        this.destroy.emit()
    }
}
