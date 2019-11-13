import {Module}          from '@nestjs/common';
import {ShardController} from './shard.controller';
import {ShardService}    from './shard.service';
import {ShardGateway}    from "./shard.gateway";
import {DATABASE_MODULE} from "../lib/database/database.module";

@Module({
    imports    : [DATABASE_MODULE('shard', __dirname)],
    controllers: [ShardController],
    providers  : [ShardService, ShardGateway],
})
export class ShardModule {
}
