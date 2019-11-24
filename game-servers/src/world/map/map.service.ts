import {Inject, Injectable, Type} from '@nestjs/common';
import {MapConstants}             from "./constants";
import {MapHandler}               from "./maps/map.handler";

@Injectable()
export class MapService {


    constructor(@Inject(MapConstants.MAP) private map: MapHandler) {

    }


    start() {
        this.map.start();
    }

    stop() {
        this.map.stop();
    }
}
