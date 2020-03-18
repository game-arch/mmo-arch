let glob = require('glob')
let directories = glob.sync('dist/nest/local/*')
module.exports = {
    apps: directories.map(dir => dir.split('/').pop())
        .map(dir => ({
            instances: (dir === 'world' ? 4 : dir === 'map' ? 2 : 1),
            name: (process.env.WORLD_CONSTANT || 'maiden') + '-' + (dir === 'world' ? 'server' : dir),
            script: 'dist/nest/local/' + dir + '/main.js',
            watch: ['dist/nest/local/' + dir, 'dist/nest/lib'],
            env: {
                WORLD_CONSTANT: process.env.WORLD_CONSTANT,
                WORLD_NAME: process.env.WORLD_NAME,
                WORLD_PORT: process.env.WORLD_PORT
            },
            watch_options: {
                'followSymlinks': false
            }
        }))
}
