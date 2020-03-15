import { Connection, createConnection } from 'typeorm'
import { environment }                  from '../config/environment'
import * as path                        from 'path'
import { WorldConstants }               from '../constants/world.constants'

createConnection({
    type    : 'sqlite',
    database: path.resolve(environment.dbRoot, WorldConstants.DB_NAME + '_character.db'),
    logging : false,
}).then(async (connection: Connection) => {
    await connection.query('DELETE FROM character_equipment')
    await connection.query('DELETE FROM character_stats')
    await connection.query('DELETE FROM character')
    await connection.close()
    process.exit(0)
})
