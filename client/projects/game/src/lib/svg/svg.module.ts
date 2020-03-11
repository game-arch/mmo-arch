import { NgModule }       from '@angular/core'
import { IconComponent }  from './icon.component'
import { IconsComponent } from './icons.component'
import { CommonModule }   from '@angular/common'

@NgModule({
    imports     : [CommonModule],
    declarations: [IconComponent, IconsComponent],
    exports     : [IconComponent, IconsComponent]
})
export class SvgModule {

}
