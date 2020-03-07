import { Connection, createConnection } from "typeorm";
import { WorldConstants }               from "../constants/world.constants";
import * as path                        from "path";
import { environment }                  from "../config/environment";

createConnection({
    type    : "sqlite",
    database: path.resolve(environment.dbRoot, WorldConstants.DB_NAME + "_character.db"),
    logging : false
}).then(async (connection: Connection) => {
    await connection.query("UPDATE character set status = 'offline'");
    await connection.close();
    process.exit(0);
});
