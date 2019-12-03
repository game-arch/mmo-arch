import {Connection, createConnection} from "typeorm";
import {DB_CONFIG}                    from "../config/db.config";
import {WorldConstants}               from "../constants/world.constants";

createConnection({
    ...DB_CONFIG,
    type    : 'mysql',
    database: ''
}).then(async (connection: Connection) => {
    await connection.query('UPDATE ' + WorldConstants.DB_NAME + ".character set status = 'offline'");
    await connection.close();
    process.exit(0);
});
