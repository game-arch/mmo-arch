import { Connection, createConnection } from "typeorm";
import * as path                        from "path";
import { environment }                  from "../config/environment";

createConnection({
  type    : "sqlite",
  database: path.resolve(environment.dbRoot, "presence.db"),
  logging : false
}).then(async (connection: Connection) => {
  await connection.query("DELETE FROM world");
  await connection.close();
  process.exit(0);
});
