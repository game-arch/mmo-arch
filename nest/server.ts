import * as path from 'path'

const serverPath = process.env.SERVER_PATH || 'global/lobby'

require(path.join(__dirname, serverPath + '/main.js'))
