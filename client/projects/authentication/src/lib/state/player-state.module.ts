import {NgModule}    from "@angular/core";
import {NgxsModule}  from "@ngxs/store";
import {PlayerState} from "./player.state";

@NgModule({
    imports: [
        NgxsModule.forFeature([PlayerState])
    ]
})
export class PlayerStateModule {

}
