import {Controller, Get} from '@nestjs/common';
import {MapService}      from './map.service';

@Controller()
export class MapController {
    constructor(private readonly service: MapService) {
    }

}
