import {Module}          from "@nestjs/common";
import {ClientModule}    from "../../client/client.module";
import {TypeOrmModule}   from "@nestjs/typeorm";
import * as path         from "path";
import {environment}     from "../../lib/config/environment";
import {WorldConstants}  from "../../lib/constants/world.constants";
import {CharacterStats}  from "./entities/character-stats";
import {NpcStats}        from "./entities/npc-stats";
import {CharacterEffect} from "./entities/character-effect";
import {NpcEffect}       from "./entities/npc-effect";
import {StatsController} from "./stats.controller";

@Module({
    imports    : [
        ClientModule,
        TypeOrmModule.forFeature([CharacterStats, NpcStats, CharacterEffect, NpcEffect]),
        TypeOrmModule.forRoot({
            type       : 'sqlite',
            database   : path.resolve(environment.dbRoot, WorldConstants.DB_NAME + '_stats.db'),
            logging    : false,
            synchronize: true,
            entities   : [__dirname + '/entities/*{.ts,.js}']
        })
    ],
    controllers: [StatsController],
    providers  : []
})
export class StatsModule {
}
