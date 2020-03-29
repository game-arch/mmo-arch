import { createConnection }  from 'typeorm'
import { environment }       from './environment'
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'

export const DB_CONFIG: ConnectionOptions = {
    type        : 'mysql',
    host        : environment.mysql.host,
    port        : environment.mysql.port,
    username    : environment.mysql.username,
    password    : environment.mysql.password,
    database    : 'database',
    synchronize : true,
    insecureAuth: true,
    keepAlive   : true
}


export async function createDatabase(name: string, close: boolean = true) {
    try {
        const connection = await createConnection(<ConnectionOptions>{
            ...DB_CONFIG,
            database: ''
        })
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
    return await createConnection(<ConnectionOptions>{
        ...DB_CONFIG,
        database: name
    })
}
