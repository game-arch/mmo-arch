import { Connection, ConnectionOptions, createConnection } from 'typeorm'
import { WorldConstants }                                  from '../constants/world.constants'
import { DB_CONFIG }                    from '../config/db.config'

createConnection(<ConnectionOptions>{
    ...DB_CONFIG,
    database: WorldConstants.DB_NAME + '_character'
}).then(async (connection: Connection) => {
    await connection.query('DELETE FROM character_equipment')
    await connection.query('DELETE FROM character_stats')
    await connection.query('DELETE FROM character')
    await connection.close()
    process.exit(0)
})
