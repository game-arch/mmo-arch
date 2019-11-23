import {Controller, Get} from '@nestjs/common';
import {PhysicsService}  from './physics.service';

@Controller()
export class PhysicsController {
    constructor(private readonly service: PhysicsService) {
    }

}
