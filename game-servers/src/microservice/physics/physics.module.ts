import {Module}            from '@nestjs/common';
import {PhysicsController} from './physics.controller';
import {PhysicsService}    from './physics.service';

@Module({
    imports    : [],
    controllers: [PhysicsController],
    providers  : [PhysicsService],
})
export class PhysicsModule {
}
