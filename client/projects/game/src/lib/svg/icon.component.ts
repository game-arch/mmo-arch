import { Component, Input } from "@angular/core";

@Component({
    selector: "icon",
    template: `
        <svg viewBox="0 0 512 512" [style.width.px]="size" [style.height.px]="size">
            <use [attr.xlink:href]="'#icon-' + name"/>
        </svg>
    `
})
export class IconComponent {

    @Input()
    name = "";
    @Input()
    size = 32;
}
