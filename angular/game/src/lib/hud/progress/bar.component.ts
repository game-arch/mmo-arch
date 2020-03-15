import { Component } from '@angular/core'

@Component({
    selector   : 'bar',
    templateUrl: 'bar.component.html',
    styleUrls  : ['bar.component.scss'],
    inputs     : ['percent', 'color', 'label']
})
export class BarComponent {
    percent = 25
    color   = '#fff'
    label   = ''
}
