import { Component }         from "@angular/core";
import { GameEngineService } from "../game-engine/game-engine.service";

@Component({
    selector   : "status",
    templateUrl: "status.component.html"
})
export class StatusComponent {

    constructor(public engine: GameEngineService) {

    }
}
