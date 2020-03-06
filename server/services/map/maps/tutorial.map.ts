import { Injectable }      from "@nestjs/common";
import { TUTORIAL_CONFIG } from "../config/tutorial";
import { Subject }         from "rxjs";
import { BackendScene }    from "./backend.scene";
import Scene = Phaser.Scene;

@Injectable()
export class TutorialMap extends BackendScene implements Scene {

  constant: string = "tutorial";
  name: string     = "Tutorial Island";

  stop$ = new Subject();


  constructor() {
    super(TUTORIAL_CONFIG);
  }


}
