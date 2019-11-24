import {Module}             from '@nestjs/common';
import {CommerceController} from './commerce.controller';
import {CommerceService}    from './commerce.service';
import {DATABASE_MODULE}    from "../../lib/database.module";
import {TypeOrmModule}      from "@nestjs/typeorm";
import {WorldConstants}     from "../constants";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DATABASE_MODULE,
        type    : 'mysql',
        database: WorldConstants.DB_NAME,
        entities: [__dirname + '/entities/*{.js,.ts}']
    })],
    controllers: [CommerceController],
    providers  : [CommerceService],
})
export class CommerceModule {
}
