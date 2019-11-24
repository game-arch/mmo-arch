import {MapHandler} from "./map.handler";
import {Injectable} from "@nestjs/common";

@Injectable()
export class TutorialMap implements MapHandler {

    constant: string = 'tutorial';
    name: string     = 'Tutorial Island';

    start() {
        console.log('Tutorial Map Started');
    }

    stop() {

    }

}
