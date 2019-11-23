import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import {createConnection}     from "typeorm";
import {config}               from "./config";

export const DATABASE_MODULE: TypeOrmModuleOptions = {
    type               : 'mysql',
    host               : config.mysql.host,
    port               : config.mysql.port,
    username           : config.mysql.username,
    password           : config.mysql.password,
    database           : 'database',
    synchronize        : true,
    keepConnectionAlive: true,
    insecureAuth       : true,
    extra: {
        insecureAuth: true
    }
};

export async function createDatabase(name: string, close:boolean = true) {
    try {
        let connection = await createConnection({
            ...DATABASE_MODULE,
            type    : 'mysql',
            database: ''
        });
        await connection.query('CREATE DATABASE IF NOT EXISTS `' + name + '`');
        if (close) {
            await connection.close();
        }
        return connection;
    } catch (e) {
        console.log(e);
    }
}
