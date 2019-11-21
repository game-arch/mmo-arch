import {Module}              from '@nestjs/common';
import {CharacterController} from './character.controller';
import {CharacterService}    from './character.service';
import {DATABASE_MODULE}     from "../../lib/database.module";
import {TypeOrmModule}       from "@nestjs/typeorm";
import {Character}           from "./entities/character";

@Module({
    imports    : [
        TypeOrmModule.forFeature([Character]),
        TypeOrmModule.forRoot({
            ...DATABASE_MODULE,
            type    : 'mysql',
            database: 'character',
            entities: [__dirname + '/entities/*{.js,.ts}']
        })
    ],
    controllers: [CharacterController],
    providers  : [CharacterService],
})
export class CharacterModule {
}
