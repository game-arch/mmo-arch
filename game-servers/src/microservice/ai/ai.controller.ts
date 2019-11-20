import {Controller, Get} from '@nestjs/common';
import {AiService}       from './ai.service';

@Controller()
export class AiController {
    constructor(private readonly service: AiService) {
    }

}
