import {Controller, Get} from '@nestjs/common';
import {StatsService}    from './stats.service';

@Controller()
export class StatsController {
    constructor(private readonly service: StatsService) {
    }

}
