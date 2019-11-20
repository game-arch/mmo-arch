import {Controller, Get} from '@nestjs/common';
import {AreaService}     from './area.service';

@Controller()
export class AreaController {
    constructor(private readonly service: AreaService) {
    }

}
