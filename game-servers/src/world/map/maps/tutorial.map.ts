import {MapHandler}      from "./map.handler";
import {Injectable}      from "@nestjs/common";
import {TUTORIAL_CONFIG} from "../config/tutorial";
import {Subject}         from "rxjs";

@Injectable()
export class TutorialMap extends MapHandler {

    constant: string = 'tutorial';
    name: string     = 'Tutorial Island';

    stop$ = new Subject();


    constructor() {
        super(TUTORIAL_CONFIG);
        this.configure();
    }



}
