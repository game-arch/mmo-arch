module.exports = {
    apps: [
        {
            instances: 1,
            name: 'global-lobby',
            script: 'dist/nest/global/lobby/main.js',
            watch: ['dist/nest/global/lobby', 'dist/nest/lib'],
            watch_options: {
                'followSymlinks': false
            }
        },
        {
            instances: 1,
            name: 'global-account',
            script: 'dist/nest/global/account/main.js',
            watch: ['dist/nest/global/account', 'dist/nest/lib'],
            watch_options: {
                'followSymlinks': false
            }
        },
        {
            name: 'global-presence',
            script: 'dist/nest/global/presence/main.js',
            watch: ['dist/nest/global/presence', 'dist/nest/lib'],
            watch_options: {
                'followSymlinks': false
            }
        },
        {
            instances: 1,
            name: (process.env.WORLD_CONSTANT || 'maiden') + '-character',
            script: 'dist/nest/local/character/main.js',
            watch: ['dist/nest/local/character', 'dist/nest/lib'],
            env: {
                WORLD_CONSTANT: process.env.WORLD_CONSTANT,
                WORLD_NAME: process.env.WORLD_NAME
            },
            watch_options: {
                'followSymlinks': false
            }
        },
        {
            instances: 1,
            name: (process.env.WORLD_CONSTANT || 'maiden') + '-party',
            script: 'dist/nest/local/party/main.js',
            watch: ['dist/nest/local/party', 'dist/nest/lib'],
            env: {
                WORLD_CONSTANT: process.env.WORLD_CONSTANT,
                WORLD_NAME: process.env.WORLD_NAME
            },
            watch_options: {
                'followSymlinks': false
            }
        },
        {
            instances: 2,
            name: (process.env.WORLD_CONSTANT || 'maiden') + '-server',
            script: 'dist/nest/local/world/main.js',
            watch: ['dist/nest/local/world', 'dist/nest/lib'],
            env: {
                WORLD_CONSTANT: process.env.WORLD_CONSTANT,
                WORLD_NAME: process.env.WORLD_NAME
            },
            watch_options: {
                'followSymlinks': false
            }
        },
        {
            instances: 1,
            name: (process.env.WORLD_CONSTANT || 'maiden') + '-map',
            script: 'dist/nest/local/map/main.js',
            watch: ['dist/nest/local/map', 'dist/nest/lib'],
            env: {
                WORLD_CONSTANT: process.env.WORLD_CONSTANT,
                WORLD_NAME: process.env.WORLD_NAME
            },
            watch_options: {
                'followSymlinks': false
            }
        },
        {
            instances: 1,
            name: (process.env.WORLD_CONSTANT || 'maiden') + '-item',
            script: 'dist/nest/local/item/main.js',
            watch: ['dist/nest/local/item', 'dist/nest/lib'],
            env: {
                WORLD_CONSTANT: process.env.WORLD_CONSTANT,
                WORLD_NAME: process.env.WORLD_NAME
            },
            watch_options: {
                'followSymlinks': false
            }
        }
    ]
}
