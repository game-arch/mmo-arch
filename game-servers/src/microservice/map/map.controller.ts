import {Controller, Get} from '@nestjs/common';
import {MapService}      from './map.service';
import {EventPattern}    from "@nestjs/microservices";
import {Events}          from "../../../lib/constants/events";

@Controller()
export class MapController {
    constructor(private readonly service: MapService) {
    }


    @EventPattern(Events.CHARACTER_CREATED)
    characterCreated(data: any) {
        console.log(data);
    }
}
