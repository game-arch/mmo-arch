import {Module}             from '@nestjs/common';
import {CommerceController} from './commerce.controller';
import {CommerceService}    from './commerce.service';
import {DB_CONFIG}          from "../../lib/config/db.config";
import {TypeOrmModule}      from "@nestjs/typeorm";
import {WorldConstants}     from "../../lib/constants/world.constants";

@Module({
    imports    : [TypeOrmModule.forRoot({
        ...DB_CONFIG,
        type    : 'mysql',
        database: WorldConstants.DB_NAME,
        entities: [__dirname + '/entities/*{.js,.ts}']
    })],
    controllers: [CommerceController],
    providers  : [CommerceService],
})
export class CommerceModule {
}
