import { Component, EventEmitter, Input } from '@angular/core'

@Component({
    selector: 'app-button',
    templateUrl: 'button.component.html',
    styleUrls: ['button.component.scss'],
})
export class ButtonComponent {
    @Input() type: string
    @Input() joystick: boolean

    constructor() {
        console.log(this.type)
    }

    activateSkill(type) {
        console.log(type)
    }
}
