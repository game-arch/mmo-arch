import {Module}                 from "@nestjs/common";
import {TypeOrmModule}          from "@nestjs/typeorm";
import {DATABASE_MODULE}        from "../database.module";
import {AuditService}           from "./audit.service";
import {EventEntity}            from "./entities/event";
import {MysqlConnectionOptions} from "typeorm/driver/mysql/MysqlConnectionOptions";

@Module({
    imports  : [
        TypeOrmModule.forFeature([EventEntity], <MysqlConnectionOptions>{
            ...DATABASE_MODULE,
            type    : 'mysql',
            database: 'audit',
            entities: [__dirname + '/entities/*{.js,.ts}']
        }),
    ],
    providers: [
        AuditService
    ]
})
export class AuditModule {

}
