import { createConnection }  from 'typeorm'
import { environment }       from './environment'
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'
import * as path             from 'path'

export const DB_CONFIG: ConnectionOptions = process.env.DB_TYPE !== 'mysql' ?
                                            <any>{
                                                type       : 'sqlite',
                                                database   : path.resolve(environment.dbRoot, 'database.db'),
                                                synchronize: true
                                            } :
                                            <any>{
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
        if (DB_CONFIG.type !== 'mysql') {
            return
        }
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
        database: DB_CONFIG.type === 'mysql' ? name : path.resolve(environment.dbRoot, name + '.db')
    })
}
