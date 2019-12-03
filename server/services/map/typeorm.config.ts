import {DB_CONFIG}      from "../../lib/config/db.config";
import {WorldConstants} from "../../lib/constants/world.constants";

module.exports = {
    ...DB_CONFIG,
    database: WorldConstants.DB_NAME,
    entities: [__dirname + '/entities/*.ts']
};
