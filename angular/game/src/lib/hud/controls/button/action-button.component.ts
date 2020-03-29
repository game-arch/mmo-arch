import { Component, HostBinding, HostListener, Input } from '@angular/core'

export type Size = 'default' | 'small' | 'medium' | 'large'

@Component({
    selector   : 'action-button',
    templateUrl: 'action-button.component.html',
    styleUrls  : ['action-button.component.scss']
})
export class ActionButtonComponent {
    @Input() type  = ''
    size           = 55
    sizes          = {
        default: 55,
        small    : 32,
        medium   : 55,
        large    : 120
    }
    @Input() color = '#0000FF'
    @Input() joystick: boolean


    @HostBinding('attr.size')
    private _sizeClass: Size = 'default'

    get sizeClass(): 'default' | 'small' | 'medium' | 'large' {
        return this._sizeClass
    }

    @Input()
    set sizeClass(value: 'default' | 'small' | 'medium' | 'large') {
        this._sizeClass = value
        this.size       = this.sizes[value]

    }
}
