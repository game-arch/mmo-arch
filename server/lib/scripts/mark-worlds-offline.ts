import {Connection, createConnection} from "typeorm";
import {DB_CONFIG}                    from "../config/db.config";

createConnection({
    ...DB_CONFIG,
    type    : 'mysql',
    database: ''
}).then(async (connection: Connection) => {
    await connection.query("UPDATE presence.world set status = 'offline'");
    await connection.close();
    process.exit(0);
});
