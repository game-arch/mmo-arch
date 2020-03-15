import * as path from "path";

let serverPath = process.env.SERVER_PATH || 'global/lobby';

require(path.join(__dirname, serverPath + '/main.js'));
