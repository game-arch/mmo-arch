import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, ViewChild } from '@angular/core'
import { CharacterOffline }                                                         from '../../../../shared/actions/character.actions'
import { GameEngineService }                                                        from '../lib/game-engine/game-engine.service'
import { fromEvent, Observable }                                                    from 'rxjs'
import { takeUntil }                                                                from 'rxjs/operators'
import { Select, Store }                                                            from '@ngxs/store'
import { WorldModel }                                                               from '../state/world/world.model'
import { WorldState }                                                               from '../state/world/world.state'
import { EventBus }                                                                 from '../lib/game-engine/phaser/event-bus'
import { ChangeScene }                                                              from '../state/scene/scene.actions'

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
    @Select(WorldState)
    world$: Observable<WorldModel>

    constructor(
        public store: Store,
        public engine: GameEngineService,
        public events: EventBus
    ) {
    }


    ngAfterViewInit() {
        this.engine.init(this.canvas.nativeElement)
        this.events.listen()
        fromEvent(this.engine.game.events, 'transition_failed')
            .pipe(takeUntil(this.destroy))
            .subscribe((result: any) => {
                if (result && result.reason === 'channel') {
                    this.mapForChannels = result.map
                    // this.connection.world.socket.emit(GetMapChannels.type, new GetMapChannels(result.map), (channels) => {
                    //     this.engine.mapChannels[result.map] = channels
                    //     this.showChannels                   = true
                    // })
                }
            })
    }

    ngOnDestroy() {
        this.engine.destroy()
        this.events.stop.next()
        this.destroy.emit()
    }

    signOut(character: number) {
        this.store.dispatch(new ChangeScene('title'))
        this.store.dispatch(new CharacterOffline(character))
    }
}
