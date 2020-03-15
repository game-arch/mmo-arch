import { Component, Input } from '@angular/core'

@Component({
    selector: 'icon',
    template: `
        <ng-container *ngIf="size">
            <svg viewBox="0 0 512 512" [style.width.px]="size" [style.height.px]="size">
                <use [attr.xlink:href]="'#icon-' + name"/>
            </svg>
        </ng-container>

        <ng-container *ngIf="!size">
            <svg viewBox="0 0 512 512" [style.width]="'100%'" [style.height]="'100%'">
                <use [attr.xlink:href]="'#icon-' + name"/>
            </svg>
        </ng-container>
    `
})
export class IconComponent {

    @Input()
    name = ''
    @Input()
    size = null
}
