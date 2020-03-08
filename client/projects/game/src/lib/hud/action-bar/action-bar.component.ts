import { Component }         from "@angular/core";
import { GameEngineService } from "../../game-engine/game-engine.service";

@Component({
    selector   : "action-bar",
    templateUrl: "action-bar.component.html"
})
export class ActionBarComponent {
    skill = "skill";
    melee = "melee";

    constructor(private service: GameEngineService) {
    }
}
