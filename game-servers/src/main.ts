import {SERVER_TYPES} from "./lib/server-types";

let server:SERVER_TYPES = (process.env.SERVER_TYPE || 'lobby') as SERVER_TYPES;
require('./' + server + '/main');
