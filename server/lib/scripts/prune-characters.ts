import { Connection, createConnection } from "typeorm";
import { environment }                  from "../config/environment";
import * as path                        from "path";

createConnection({
  type    : "sqlite",
  database: path.resolve(environment.dbRoot, "presence.db"),
  logging : false
}).then(async (connection: Connection) => {
  await connection.query("DELETE FROM character");
  await connection.close();
  process.exit(0);
});
