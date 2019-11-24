module.exports = {
    apps: [
        {
            name: 'world-server-' + (process.env.WORLD_CONSTANT || 'maiden'),
            script: 'dist/src/main.js',
            instances: 2,
            exec_mode: 'cluster',
            watch: ["dist/src/world/server", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'world/server',
                SHARD_PORT: '3002',
                WORLD_CONSTANT: process.env.WORLD_CONSTANT || 'maiden',
                WORLD_NAME: process.env.WORLD_NAME || 'Maiden'
            }
        },
        {
            name: 'world-quest-' + (process.env.WORLD_CONSTANT || 'maiden'),
            script: 'dist/src/main.js',
            watch: ["dist/src/world/quest", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'world/quest',
                WORLD_CONSTANT: process.env.WORLD_CONSTANT || 'maiden',
                WORLD_NAME: process.env.WORLD_NAME || 'Maiden'
            }
        },
        {
            name: 'world-commerce-' + (process.env.WORLD_CONSTANT || 'maiden'),
            script: 'dist/src/main.js',
            watch: ["dist/src/world/commerce", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'world/commerce',
                WORLD_CONSTANT: process.env.WORLD_CONSTANT || 'maiden',
                WORLD_NAME: process.env.WORLD_NAME || 'Maiden'
            }
        },
        {
            name: 'world-ai-' + (process.env.WORLD_CONSTANT || 'maiden'),
            script: 'dist/src/main.js',
            watch: ["dist/src/world/ai", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'world/ai',
                WORLD_CONSTANT: process.env.WORLD_CONSTANT || 'maiden',
                WORLD_NAME: process.env.WORLD_NAME || 'Maiden'
            }
        },
        {
            name: 'world-character-' + (process.env.WORLD_CONSTANT || 'maiden'),
            script: 'dist/src/main.js',
            watch: ["dist/src/world/character", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'world/character',
                WORLD_CONSTANT: process.env.WORLD_CONSTANT || 'maiden',
                WORLD_NAME: process.env.WORLD_NAME || 'Maiden'
            }
        },
        {
            name: 'world-item-' + (process.env.WORLD_CONSTANT || 'maiden'),
            script: 'dist/src/main.js',
            watch: ["dist/src/world/item", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'world/item',
                WORLD_CONSTANT: process.env.WORLD_CONSTANT || 'maiden',
                WORLD_NAME: process.env.WORLD_NAME || 'Maiden'
            }
        },
        {
            name: 'world-map-' + (process.env.WORLD_CONSTANT || 'maiden'),
            script: 'dist/src/main.js',
            watch: ["dist/src/world/map", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'world/map',
                MAP: 'tutorial',
                WORLD_CONSTANT: process.env.WORLD_CONSTANT || 'maiden',
                WORLD_NAME: process.env.WORLD_NAME || 'Maiden'
            }
        }
    ]
};
