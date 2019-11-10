import {Module}          from '@nestjs/common';
import {ShardController} from './shard.controller';
import {ShardService}    from './shard.service';

@Module({
    imports    : [],
    controllers: [ShardController],
    providers  : [ShardService],
})
export class ShardModule {
}
