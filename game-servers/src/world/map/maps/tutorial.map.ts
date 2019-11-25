import {MapHandler}      from "./map.handler";
import {Injectable}      from "@nestjs/common";
import {TUTORIAL_CONFIG} from "../config/tutorial";

@Injectable()
export class TutorialMap implements MapHandler {

    constant: string = 'tutorial';
    name: string     = 'Tutorial Island';

    config = TUTORIAL_CONFIG;

    start() {
        console.log('Tutorial Map Started');
    }

    stop() {

    }

}
