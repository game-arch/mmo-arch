import {DATABASE_MODULE} from "../../lib/database.module";
import {WorldConstants}  from "../constants";

module.exports = {
    ...DATABASE_MODULE,
    database: WorldConstants.DB_NAME,
    entities: [__dirname + '/entities/*.ts']
};
