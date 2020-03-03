import { PlayerDirectionalInput } from '../../../../../../../server/services/map/actions'
import { Component, ViewChild } from '@angular/core'
import { ConnectionManager } from '../../connection/connection-manager'
import { JoystickEvent, NgxJoystickComponent } from 'ngx-joystick'
import { JoystickManagerOptions, JoystickOutputData } from 'nipplejs'

@Component({
    selector: 'game-joystick',
    templateUrl: 'joystick.component.html',
})
export class JoystickComponent {
    @ViewChild('staticJoystic', { static: true })
    staticJoystick: NgxJoystickComponent

    staticOptions: JoystickManagerOptions = {
        mode: 'static',
        position: { left: '10%', top: '90%' },
        color: 'blue',
    }

    lastDirection

    directionMap = {
        down: 'down',
        up: 'up',
        left: 'left',
        right: 'right',
    }
    directions = {
        up: false,
        down: false,
        right: false,
        left: false,
    }

    staticOutputData: JoystickOutputData
    directionStatic: string
    interactingStatic: boolean

    onStartStatic(event: JoystickEvent) {
        this.interactingStatic = true
    }

    onEndStatic(event: JoystickEvent) {
        this.interactingStatic = false
        this.directions = {
            up: false,
            down: false,
            right: false,
            left: false,
        }
        this.sendDirectionalInput()
    }

    onMoveStatic(event: JoystickEvent) {
        this.staticOutputData = event.data
        this.directions[event.data.direction.angle] = true
    }

    onPlainUpStatic(event: JoystickEvent) {
        this.directionStatic = 'UP'
        this.toggleDirection(event, true)
    }

    onPlainDownStatic(event: JoystickEvent) {
        this.directionStatic = 'DOWN'
        this.toggleDirection(event, true)
    }

    onPlainLeftStatic(event: JoystickEvent) {
        this.directionStatic = 'LEFT'
        this.toggleDirection(event, true)
    }

    onPlainRightStatic(event: JoystickEvent) {
        this.directionStatic = 'RIGHT'
        this.toggleDirection(event, true)
    }

    toggleDirection(event: JoystickEvent, status: boolean) {
        this.lastDirection = event.data.direction.angle
        if (this.directionMap.hasOwnProperty(event.data.direction.angle)) {
            let direction = this.directionMap[event.data.direction.angle]
            if (this.directions[direction] !== status) {
                this.directions[direction] = status
                this.sendDirectionalInput()
            }
        }
    }

    private sendDirectionalInput() {
        this.world.socket.emit(PlayerDirectionalInput.event, {
            directions: this.directions,
        })
    }

    get world() {
        return this.connection.world
    }

    constructor(public connection: ConnectionManager) {}
}
