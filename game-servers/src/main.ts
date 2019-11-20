import * as path from "path";

require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
});

require('./' + (process.env.SERVER_TYPE || 'lobby') + '/main');
