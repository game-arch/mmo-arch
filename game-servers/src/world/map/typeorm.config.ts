import {DATABASE_MODULE} from "../../lib/database.module";
import {WorldConstants}  from "../constants";

module.exports = {
    ...DATABASE_MODULE,
    database: WorldConstants.DB_PREFIX + '_map',
    entities: [__dirname + '/entities/*.ts']
};
