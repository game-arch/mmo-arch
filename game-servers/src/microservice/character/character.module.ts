import {Module}              from '@nestjs/common';
import {CharacterController} from './character.controller';
import {CharacterService}    from './character.service';
import {DATABASE_MODULE}     from "../../lib/database/database.module";
import {TypeOrmModule}       from "@nestjs/typeorm";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DATABASE_MODULE,
        type    : 'mysql',
        database: 'character',
        entities: [__dirname + '/entities/*{.js,.ts}']
    })],
    controllers: [CharacterController],
    providers  : [CharacterService],
})
export class CharacterModule {
}
