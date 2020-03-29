let path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '.env')
})
module.exports = {
    apps: [
        {
            instances: 1,
            name: 'server.global.lobby',
            script: 'dist/nest/global/lobby/main.js',
            watch: ['dist/nest/global/lobby', 'dist/nest/lib'],
            watch_options: {
                'followSymlinks': false
            },
            env: {
                DB_TYPE: process.env.DB_TYPE,
                MYSQL_HOST: process.env.MYSQL_HOST,
                MYSQL_PORT: process.env.MYSQL_PORT,
                MYSQL_USERNAME: process.env.MYSQL_USERNAME,
                MYSQL_PASSWORD: process.env.MYSQL_PASSWORD
            }
        },
        {
            instances: 1,
            name: 'server.global.account',
            script: 'dist/nest/global/account/main.js',
            watch: ['dist/nest/global/account', 'dist/nest/lib'],
            watch_options: {
                'followSymlinks': false
            },
            env: {
                DB_TYPE: process.env.DB_TYPE,
                MYSQL_HOST: process.env.MYSQL_HOST,
                MYSQL_PORT: process.env.MYSQL_PORT,
                MYSQL_USERNAME: process.env.MYSQL_USERNAME,
                MYSQL_PASSWORD: process.env.MYSQL_PASSWORD
            }
        },
        {
            name: 'server.global.presence',
            script: 'dist/nest/global/presence/main.js',
            watch: ['dist/nest/global/presence', 'dist/nest/lib'],
            watch_options: {
                'followSymlinks': false
            },
            env: {
                DB_TYPE: process.env.DB_TYPE,
                MYSQL_HOST: process.env.MYSQL_HOST,
                MYSQL_PORT: process.env.MYSQL_PORT,
                MYSQL_USERNAME: process.env.MYSQL_USERNAME,
                MYSQL_PASSWORD: process.env.MYSQL_PASSWORD
            }
        }

    ]
}
