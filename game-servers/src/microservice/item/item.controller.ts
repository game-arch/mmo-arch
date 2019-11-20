import {Controller, Get} from '@nestjs/common';
import {ItemService}     from './item.service';

@Controller()
export class ItemController {
    constructor(private readonly service: ItemService) {
    }

}
