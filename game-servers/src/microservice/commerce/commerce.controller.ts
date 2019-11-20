import {Controller, Get} from '@nestjs/common';
import {CommerceService} from './commerce.service';

@Controller()
export class CommerceController {
    constructor(private readonly service: CommerceService) {
    }

}
