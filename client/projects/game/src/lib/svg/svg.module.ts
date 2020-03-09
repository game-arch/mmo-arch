import { NgModule }       from "@angular/core";
import { IconComponent }  from "./icon.component";
import { IconsComponent } from "./icons.component";

@NgModule({
    imports     : [],
    declarations: [IconComponent, IconsComponent],
    exports     : [IconComponent, IconsComponent]
})
export class SvgModule {

}
