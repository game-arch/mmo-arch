import { Injectable }        from "@angular/core";
import { Location }          from "@angular/common";
import { ConnectionManager } from "../../../connection/connection-manager";
import { TitleScene }        from "./title/title.scene";
import { TutorialScene }     from "./tutorial/tutorial.scene";

@Injectable()
export class SceneFactory {

    constructor(
        private connection: ConnectionManager,
        private location: Location
    ) {

    }

    title() {
        return new TitleScene(this.location);
    }

    tutorial() {
        return new TutorialScene(this.connection);
    }
}
