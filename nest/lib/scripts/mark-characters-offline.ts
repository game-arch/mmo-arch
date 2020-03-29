import { Connection, ConnectionOptions, createConnection } from 'typeorm'
import { WorldConstants }                                  from '../constants/world.constants'
import { DB_CONFIG }                                       from '../config/db.config'

createConnection(<ConnectionOptions>{
    ...DB_CONFIG,
    database: WorldConstants.DB_NAME + '_character'
}).then(async (connection: Connection) => {
    await connection.query('UPDATE character set status = \'offline\'')
    await connection.close()
    process.exit(0)
})
