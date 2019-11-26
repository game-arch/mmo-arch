import {Injectable}        from "@angular/core";
import {Location}          from "@angular/common";
import {ConnectionManager} from "../../../../../connection/src/lib/connection-manager";
import {TitleScene}        from "./title.scene";

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
}
