module.exports = {
    apps: [
        {
            instances: 1,
            name: 'global-lobby',
            script: 'dist/services/lobby/main.js',
            watch: ["dist/services/lobby", "dist/lib"],
            watch_options: {
                "followSymlinks": false
            }
        },
        {
            instances: 1,
            name: 'global-account',
            script: 'dist/services/account/main.js',
            watch: ["dist/services/account", "dist/lib"],
            watch_options: {
                "followSymlinks": false
            }
        },
        {
            name: 'global-presence',
            script: 'dist/services/presence/main.js',
            watch: ["dist/services/presence", "dist/lib"],
            watch_options: {
                "followSymlinks": false
            }
        },
        {
            instances: 1,
            name: (process.env.WORLD_CONSTANT || 'maiden') + '-item',
            script: 'dist/services/item/main.js',
            watch: ["dist/services/item", "dist/lib"],
            env: {
                WORLD_CONSTANT: process.env.WORLD_CONSTANT,
                WORLD_NAME: process.env.WORLD_NAME
            },
            watch_options: {
                "followSymlinks": false
            }
        },
        {
            instances: 1,
            name: (process.env.WORLD_CONSTANT || 'maiden') + '-quest',
            script: 'dist/services/quest/main.js',
            watch: ["dist/services/quest", "dist/lib"],
            env: {
                WORLD_CONSTANT: process.env.WORLD_CONSTANT,
                WORLD_NAME: process.env.WORLD_NAME
            },
            watch_options: {
                "followSymlinks": false
            }
        },
        {
            instances: 1,
            name: (process.env.WORLD_CONSTANT || 'maiden') + '-character',
            script: 'dist/services/character/main.js',
            watch: ["dist/services/character", "dist/lib"],
            env: {
                WORLD_CONSTANT: process.env.WORLD_CONSTANT,
                WORLD_NAME: process.env.WORLD_NAME
            },
            watch_options: {
                "followSymlinks": false
            }
        },
        {
            instances: 2,
            name: (process.env.WORLD_CONSTANT || 'maiden') + '-server',
            script: 'dist/services/world/main.js',
            watch: ["dist/services/world", "dist/lib"],
            env: {
                WORLD_CONSTANT: process.env.WORLD_CONSTANT,
                WORLD_NAME: process.env.WORLD_NAME
            },
            watch_options: {
                "followSymlinks": false
            }
        },
        {
            instances: 1,
            name: (process.env.WORLD_CONSTANT || 'maiden') + '-commerce',
            script: 'dist/services/commerce/main.js',
            watch: ["dist/services/commerce", "dist/lib"],
            env: {
                WORLD_CONSTANT: process.env.WORLD_CONSTANT,
                WORLD_NAME: process.env.WORLD_NAME
            },
            watch_options: {
                "followSymlinks": false
            }
        },
        {
            instances: 1,
            name: (process.env.WORLD_CONSTANT || 'maiden') + '-map',
            script: 'dist/services/map/main.js',
            watch: ["dist/services/map", "dist/lib"],
            env: {
                WORLD_CONSTANT: process.env.WORLD_CONSTANT,
                WORLD_NAME: process.env.WORLD_NAME
            },
            watch_options: {
                "followSymlinks": false
            }
        }
    ]
};
