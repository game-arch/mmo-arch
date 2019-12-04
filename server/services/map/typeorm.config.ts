import {WorldConstants} from "../../lib/constants/world.constants";
import {MapConstants}   from "./constants";

module.exports = {
    type       : 'sqlite',
    database   : WorldConstants.DB_NAME + '_' + MapConstants.MAP + '.db',
    logging    : false,
    synchronize: true,
    entities   : [__dirname + '/entities/*{.ts,.js}'],
};
