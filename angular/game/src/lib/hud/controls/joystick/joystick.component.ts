import { Component, EventEmitter, Input } from '@angular/core'
import { JoystickEvent }                  from 'ngx-joystick'
import { takeUntil }                      from 'rxjs/operators'
import { GameEngineService }              from '../../../game-engine/game-engine.service'

@Component({
    selector   : 'joystick',
    templateUrl: 'joystick.component.html'
})
export class JoystickComponent {
    @Input() enabled   = false
    options            = {
        mode    : 'static',
        position: { left: '64px', bottom: '64px' },
        color   : 'white'
    }
    joystickThreshould = 0.3
    moveEvents         = new EventEmitter()
    destroy            = new EventEmitter()

    directions

    constructor(private service: GameEngineService) {
    }

    ngAfterViewInit() {
        this.moveEvents.pipe(takeUntil(this.destroy)).subscribe(directions => {
            this.service.game.events.emit('input.joystick', directions)
        })
    }

    ngOnDestroy() {
        this.destroy.emit()
    }

    onStart($event: JoystickEvent) {
        this.directions = {
            left : false,
            right: false,
            up   : false,
            down : false
        }
        this.moveEvents.emit(this.directions)
    }

    onEnd($event: JoystickEvent) {
        this.directions = {
            left : false,
            right: false,
            up   : false,
            down : false
        }
        this.moveEvents.emit(this.directions)
    }

    onMove(event: JoystickEvent) {
        const lastDirection = this.directions
        this.directions   = {
            left : event.data.vector.x < -this.joystickThreshould,
            right: event.data.vector.x > this.joystickThreshould,
            up   : event.data.vector.y > this.joystickThreshould,
            down : event.data.vector.y < -this.joystickThreshould
        }
        if (JSON.stringify(lastDirection) !== JSON.stringify(this.directions)) {
            this.moveEvents.emit(this.directions)
        }
    }
}
