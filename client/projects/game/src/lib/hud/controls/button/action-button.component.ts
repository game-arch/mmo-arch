import { Component, HostListener, Input } from "@angular/core";

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

    @HostListener("click", ["$event"])
    activateSkill(event) {
        console.log(this.type);
    }
}
