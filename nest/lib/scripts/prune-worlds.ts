import { Connection, ConnectionOptions, createConnection } from 'typeorm'
import { DB_CONFIG }                                       from '../config/db.config'

createConnection(<ConnectionOptions>{
    ...DB_CONFIG,
    database: 'presence'
}).then(async (connection: Connection) => {
    await connection.query('DELETE FROM world')
    await connection.close()
    process.exit(0)
})
