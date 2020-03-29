import { createConnection }       from 'typeorm'
import { environment }            from './environment'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'

export const DB_CONFIG: MysqlConnectionOptions = {
    type        : 'mysql',
    host        : environment.mysql.host,
    port        : environment.mysql.port,
    username    : environment.mysql.username,
    password    : environment.mysql.password,
    database    : '',
    synchronize : true,
    insecureAuth: true
}


export async function createDatabase(name: string, close: boolean = true) {
    try {
        const connection = await createConnection(DB_CONFIG)
        await connection.query('CREATE DATABASE IF NOT EXISTS `' + name + '`')
        if (close) {
            await connection.close()
        }
        return connection
    } catch (e) {
        console.log(e)
    }
}

export async function connectDatabase(name: string) {
    return await createConnection(<MysqlConnectionOptions>{
        ...DB_CONFIG,
        database: name
    })
}
