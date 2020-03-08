import { Component, Input } from "@angular/core";

@Component({
    selector   : "action-button",
    templateUrl: "action-button.component.html",
    styleUrls  : ["action-button.component.scss"]
})
export class ActionButtonComponent {
    @Input() type: string;
    @Input() joystick: boolean;

    constructor() {
        console.log(this.type);
    }

    activateSkill(type) {
        console.log(type);
    }
}
