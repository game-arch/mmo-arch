import {SERVER_TYPES} from "./constants";

let server:SERVER_TYPES = (process.env.SERVER_TYPE || 'lobby') as SERVER_TYPES;
console.log(server);
require('./' + server + '/main');
