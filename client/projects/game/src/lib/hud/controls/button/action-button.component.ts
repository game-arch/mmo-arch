import { Component, HostListener, Input } from '@angular/core'

export type Size = 'default' | 'small' | 'medium' | 'large'
@Component({
    selector: 'action-button',
    templateUrl: 'action-button.component.html',
    styleUrls: ['action-button.component.scss'],
})
export class ActionButtonComponent {
    @Input() type = 'skill'
    @Input() sizeClass: Size = 'default'
    @Input() color = '#0000FF'
    @Input() joystick: boolean

    constructor() {
        console.log(this.type)
    }

    @HostListener('click', ['$event'])
    activateSkill(event) {
        console.log(this.type)
    }
}
