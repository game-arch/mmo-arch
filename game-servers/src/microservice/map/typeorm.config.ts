import {DATABASE_MODULE} from "../../lib/database.module";

module.exports = {
    ...DATABASE_MODULE,
    database: 'map',
    entities: [__dirname + '/entities/*.ts']
};
