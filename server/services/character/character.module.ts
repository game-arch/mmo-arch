import {Module}                   from '@nestjs/common';
import {CharacterController}      from './character.controller';
import {CharacterService}         from './character.service';
import {DB_CONFIG}                from "../../lib/config/db.config";
import {TypeOrmModule}            from "@nestjs/typeorm";
import {Character}                from "./entities/character";
import {CharacterEmitter}         from "./character.emitter";
import {MicroserviceClientModule} from "../../lib/microservice-client/microservice-client.module";
import {WorldConstants}           from "../../lib/constants/world.constants";

@Module({
    imports    : [
        MicroserviceClientModule,
        TypeOrmModule.forFeature([Character]),
        TypeOrmModule.forRoot({
            ...DB_CONFIG,
            type    : 'mysql',
            database: WorldConstants.DB_NAME,
            entities: [__dirname + '/entities/*{.js,.ts}']
        })
    ],
    controllers: [CharacterController],
    providers  : [CharacterService, CharacterEmitter],
})
export class CharacterModule {
}
