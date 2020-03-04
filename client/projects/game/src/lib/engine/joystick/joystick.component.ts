import { Component, EventEmitter } from '@angular/core'
import { JoystickEvent } from 'ngx-joystick'
import { takeUntil } from 'rxjs/operators'
import { GameEngineService } from '../game-engine.service'
import { interval } from 'rxjs'

@Component({
    selector: 'joystick',
    templateUrl: 'joystick.component.html',
    inputs: ['enabled'],
})
export class JoystickComponent {
    enabled = false
    options = {
        mode: 'static',
        position: { left: '120px', bottom: '120px' },
        color: 'white',
    }
    joystickThreshould = 0.3
    moveEvents = new EventEmitter()
    destroy = new EventEmitter()
    stopMove = new EventEmitter()

    directions

    constructor(private service: GameEngineService) {}

    ngAfterViewInit() {
        this.moveEvents.pipe(takeUntil(this.destroy)).subscribe(directions => {
            console.log('event!')
            this.service.game.events.emit('input.joystick', directions)
        })
    }

    ngOnDestroy() {
        this.destroy.emit()
    }

    onStart($event: JoystickEvent) {
        this.directions = {
            left: false,
            right: false,
            up: false,
            down: false,
        }
        this.moveEvents.emit(this.directions)
        interval(300)
            .pipe(takeUntil(this.destroy), takeUntil(this.stopMove))
            .subscribe(() => this.moveEvents.emit(this.directions))
    }

    onEnd($event: JoystickEvent) {
        this.directions = {
            left: false,
            right: false,
            up: false,
            down: false,
        }
        this.moveEvents.emit(this.directions)
        this.stopMove.emit()
    }

    onMove(event: JoystickEvent) {
        this.directions = {
            left: event.data.vector.x < -this.joystickThreshould,
            right: event.data.vector.x > this.joystickThreshould,
            up: event.data.vector.y > this.joystickThreshould,
            down: event.data.vector.y < -this.joystickThreshould,
        }
    }
}
