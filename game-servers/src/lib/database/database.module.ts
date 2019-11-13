import {TypeOrmModule} from "@nestjs/typeorm";

export const DATABASE_MODULE = (databaseName:string, rootPath:string) => TypeOrmModule.forRoot({
    type       : 'mongodb',
    host       : 'localhost',
    port       : 27017,
    username   : 'root',
    password   : '',
    database   : databaseName,
    entities   : [
        rootPath + '/**/*.entity{.ts,.js}',
    ],
    synchronize: true,
});
