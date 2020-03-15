import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core'

@Component({
    selector     : 'avatar',
    styleUrls    : ['avatar.component.scss'],
    templateUrl  : 'avatar.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AvatarComponent {
    @Input()
    public avatar: string
    @Output()
    public clickOnAvatar: EventEmitter<any> = new EventEmitter<any>()

    constructor() {
    }

    public onAvatarClicked(): void {
        console.log('avatar clicked!')
    }
}
