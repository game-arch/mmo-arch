import {SERVER_TYPES} from "./lib/server-types";
import * as path      from "path";

require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
});
let server: SERVER_TYPES = (process.env.SERVER_TYPE || 'lobby') as SERVER_TYPES;
require('./' + server + '/main');
