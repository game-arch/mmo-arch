import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import {createConnection}     from "typeorm";

export const DATABASE_MODULE:TypeOrmModuleOptions = {
    type       : 'mysql',
    host       : 'localhost',
    port       : 3306,
    username   : 'root',
    password   : 'root',
    database   : 'database',
    synchronize: true,
    keepConnectionAlive: true
};
export async function createDatabase(name:string) {
    try {
        let connection = await createConnection({
            ...DATABASE_MODULE,
            type    : 'mysql',
            database: ''
        });
        await connection.query('CREATE DATABASE IF NOT EXISTS ' + name);
        await connection.close();
    } catch (e) {
        console.log(e);
    }
}
