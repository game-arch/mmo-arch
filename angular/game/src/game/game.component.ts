import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, ViewChild } from '@angular/core'
import { ConnectionManager }                                                        from '../lib/connection/connection-manager'
import { CharacterOffline }                                                         from '../../../../shared/events/character.events'
import { GameEngineService }                                                        from '../lib/game-engine/game-engine.service'
import { fromEvent }                                                                from 'rxjs'
import { takeUntil }                                                                from 'rxjs/operators'
import { GetMapChannels }                                                           from '../../../../shared/events/map.events'

@Component({
    selector   : 'game',
    templateUrl: 'game.component.html',
    styleUrls  : ['game.component.scss']
})
export class GameComponent implements AfterViewInit, OnDestroy {
    @ViewChild('canvas', { static: true })
    canvas: ElementRef
    destroy = new EventEmitter()

    mapForChannels = ''
    showChannels   = false

    constructor(
        public connection: ConnectionManager,
        public engine: GameEngineService
    ) {
    }

    get world() {
        return this.connection.world
    }

    ngAfterViewInit() {
        this.engine.init(this.canvas.nativeElement)
        fromEvent(this.engine.game.events, 'transition_failed')
            .pipe(takeUntil(this.destroy))
            .subscribe((result: any) => {
                if (result && result.reason === 'channel') {
                    this.mapForChannels = result.map
                    this.connection.world.socket.emit(GetMapChannels.event, new GetMapChannels(result.map), (channels) => {
                        this.engine.mapChannels[result.map] = channels
                        this.showChannels                   = true
                    })
                }
            })
    }

    ngOnDestroy() {
        this.engine.destroy()
        this.destroy.emit()
    }

    signOut() {
        this.engine.game.events.emit('game.scene', 'title')
        this.world.socket.emit(CharacterOffline.event)
        this.world.selectedCharacter = null
    }
}
