let glob = require('glob')
let path = require('path')
let directories = glob.sync('dist/nest/local/*')
let maps = glob.sync(path.resolve(__dirname, 'shared/maps/*.ts'))
require('dotenv').config({
    path: path.resolve(__dirname, '.env')
})
module.exports = {
    apps: directories.map(dir => dir.split('/').pop())
        .filter(dir => dir !== 'map')
        .map(dir => ({
            instances: (dir === 'world' ? 4 : 1),
            name: 'server.world.' + (process.env.WORLD_CONSTANT || 'maiden') + '.' + (dir === 'world' ? 'server' : dir),
            script: 'dist/nest/local/' + dir + '/main.js',
            watch: ['dist/nest/local/' + dir, 'dist/nest/lib'],
            env: {
                DB_TYPE: process.env.DB_TYPE,
                MYSQL_HOST: process.env.MYSQL_HOST,
                MYSQL_PORT: process.env.MYSQL_PORT,
                MYSQL_USERNAME: process.env.MYSQL_USERNAME,
                MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
                WORLD_CONSTANT: process.env.WORLD_CONSTANT,
                WORLD_NAME: process.env.WORLD_NAME,
                WORLD_PORT: process.env.WORLD_PORT
            },
            watch_options: {
                'followSymlinks': false
            }
        }))
        .concat(maps.map(map => map.split('/').pop().split('.')[0]).map(map => ({
            instances: 2,
            name: 'server.world.' + (process.env.WORLD_CONSTANT || 'maiden') + '.map.' + map,
            script: 'dist/nest/local/map/main.js',
            watch: ['dist/nest/local/map', 'dist/nest/lib', 'dist/shared'],
            env: {
                DB_TYPE: process.env.DB_TYPE,
                MYSQL_HOST: process.env.MYSQL_HOST,
                MYSQL_PORT: process.env.MYSQL_PORT,
                MYSQL_USERNAME: process.env.MYSQL_USERNAME,
                MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
                MAP: map,
                WORLD_CONSTANT: process.env.WORLD_CONSTANT,
                WORLD_NAME: process.env.WORLD_NAME,
                WORLD_PORT: process.env.WORLD_PORT
            },
            watch_options: {
                'followSymlinks': false
            }
        })))
}
