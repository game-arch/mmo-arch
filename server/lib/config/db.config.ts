import { createConnection } from "typeorm";
import { environment }      from "./environment";

export const DB_CONFIG = {
  type        : "mysql",
  host        : environment.mysql.host,
  port        : environment.mysql.port,
  username    : environment.mysql.username,
  password    : environment.mysql.password,
  database    : "database",
  synchronize : true,
  insecureAuth: true,
  keepAlive   : true
};


export async function createDatabase(name: string, close: boolean = true) {
  try {
    let connection = await createConnection({
      ...DB_CONFIG,
      type    : "mysql",
      database: ""
    });
    await connection.query("CREATE DATABASE IF NOT EXISTS `" + name + "`");
    if (close) {
      await connection.close();
    }
    return connection;
  } catch (e) {
    console.log(e);
  }
}
