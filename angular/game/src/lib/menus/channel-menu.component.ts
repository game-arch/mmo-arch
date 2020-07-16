import { Component, EventEmitter, HostBinding, OnDestroy, OnInit } from '@angular/core'
import { GameEngineService }                                       from '../game-engine/game-engine.service'
import {
    ChangeMapChannel,
    GetMapChannels,
    MapChannels,
    PlayerAttemptedTransition
}                                                                  from '../../../../../shared/actions/map.actions'
import { Observable }                                              from 'rxjs'
import { WorldModel }                                              from '../../state/world/world.model'
import { Select, Store }                                           from '@ngxs/store'
import { WorldState }                                              from '../../state/world/world.state'

@Component({
    selector   : 'channel-menu',
    templateUrl: 'channel-menu.component.html',
    styleUrls  : ['channel-menu.component.scss'],
    inputs     : ['map', 'character', 'forCharacterSelection'],
    outputs    : ['selected', 'close']
})
export class ChannelMenuComponent implements OnInit, OnDestroy {
    @Select(WorldState)
    world$: Observable<WorldModel>
    @HostBinding('class.shown')
    shown                 = true
    map                   = ''
    character: number     = null
    forCharacterSelection = false
    destroy               = new EventEmitter()
    selected              = new EventEmitter()
    close                 = new EventEmitter()

    constructor(private game: GameEngineService, private store: Store) {
    }


    ngOnInit() {
        this.shown            = true
        let world: WorldModel = this.store.selectSnapshot(WorldState)
        world.socket.emit(GetMapChannels.type, new GetMapChannels(this.game.currentSceneKey), (channels) => {
            this.store.dispatch(new MapChannels(world.character, this.game.currentSceneKey, channels))
        })
    }

    selectChannel(channel: number) {
        this.selected.emit()
        let world: WorldModel = this.store.selectSnapshot(WorldState)
        if (this.map !== '') {
            world.socket.emit(PlayerAttemptedTransition.type, channel, (result) => {
                if (!result.status) {
                    world.socket.emit(GetMapChannels.type, new GetMapChannels(result.map, this.character), (channels) => {
                        this.game.mapChannels[result.map] = channels
                        this.store.dispatch(new MapChannels(this.character, result.map, channels))
                    })
                } else {
                    this.selected.emit()
                }
            })
            return
        }
        if (!this.forCharacterSelection) {
            world.socket.emit(ChangeMapChannel.type, channel)
            this.selected.emit()
            return
        }
        this.selected.emit(channel)
    }

    ngOnDestroy() {
        this.destroy.emit()
    }
}
