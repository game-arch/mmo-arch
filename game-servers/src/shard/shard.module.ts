import {Module}          from '@nestjs/common';
import {ShardController} from './shard.controller';
import {ShardService}    from './shard.service';
import {ShardGateway}    from "./shard.gateway";

@Module({
    imports    : [],
    controllers: [ShardController],
    providers  : [ShardService, ShardGateway],
})
export class ShardModule {
}
