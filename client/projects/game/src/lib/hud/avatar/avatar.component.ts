import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
    selector: 'avatar',
    styleUrls: ['avatar.component.scss'],
    templateUrl: 'avatar.component.html',
})
export class AvatarComponent {
    @Input()
    public avatar: string
    @Output()
    public clickOnAvatar: EventEmitter<any> = new EventEmitter<any>()

    constructor() {}

    public onAvatarClicked(): void {
        console.log('avatar clicked!')
    }
}
