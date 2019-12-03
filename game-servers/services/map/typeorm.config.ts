import {DB_CONFIG}      from "../../config/db.config";
import {WorldConstants} from "../../config/world.constants";

module.exports = {
    ...DB_CONFIG,
    database: WorldConstants.DB_NAME,
    entities: [__dirname + '/entities/*.ts']
};
