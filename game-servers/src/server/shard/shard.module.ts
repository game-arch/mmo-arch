import {Module}              from '@nestjs/common';
import {ShardController}     from './shard.controller';
import {ShardService}        from './shard.service';
import {ShardGateway}        from "./shard.gateway";
import {DATABASE_MODULE}     from "../../lib/database/database.module";
import {TypeOrmModule}       from "@nestjs/typeorm";
import {Character}           from "./entities/character";
import {AccountClientModule} from "../../lib/microservice-clients/account/account-client.module";

@Module({
    imports    : [
        AccountClientModule,
        TypeOrmModule.forFeature([Character]),
        TypeOrmModule.forRoot({
            ...DATABASE_MODULE,
            type    : 'mysql',
            database: 'shard',
            entities: [__dirname + '/entities/*{.js,.ts}']
        })
    ],
    controllers: [ShardController],
    providers  : [ShardService, ShardGateway],
})
export class ShardModule {
}
