import {Module}          from '@nestjs/common';
import {ShardController} from './shard.controller';
import {ShardService}    from './shard.service';
import {ShardGateway}    from "./shard.gateway";
import {DATABASE_MODULE} from "../lib/database/database.module";
import {TypeOrmModule}   from "@nestjs/typeorm";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DATABASE_MODULE,
        type    : 'mongodb',
        database: 'shard',
        entities: [__dirname + '/**/*.entity{.js,.ts}']
    })],
    controllers: [ShardController],
    providers  : [ShardService, ShardGateway],
})
export class ShardModule {
}
