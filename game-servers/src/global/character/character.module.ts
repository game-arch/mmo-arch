import {Module}                   from '@nestjs/common';
import {CharacterController}      from './character.controller';
import {CharacterService}         from './character.service';
import {DATABASE_MODULE}          from "../../lib/database.module";
import {TypeOrmModule}            from "@nestjs/typeorm";
import {Character}                from "./entities/character";
import {CharacterEmitter}         from "./character.emitter";
import {MicroserviceClientModule} from "../../lib/microservice-client.module";

@Module({
    imports    : [
        MicroserviceClientModule,
        TypeOrmModule.forFeature([Character]),
        TypeOrmModule.forRoot({
            ...DATABASE_MODULE,
            type    : 'mysql',
            database: 'character',
            entities: [__dirname + '/entities/*{.js,.ts}']
        })
    ],
    controllers: [CharacterController],
    providers  : [CharacterService, CharacterEmitter],
})
export class CharacterModule {
}
