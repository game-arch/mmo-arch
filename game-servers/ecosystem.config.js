module.exports = {
    apps: [
        {
            name: '_redis',
            script: 'redis-server',
            watch: false
        },
        {
            name: '_builder',
            script: 'npm run build -- --watch',
            watch: false
        },
        {
            name: 'micro-commerce',
            script: 'dist/src/main.js',
            watch: ["dist/src/microservice/commerce", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'microservice/commerce'
            }
        },
        {
            name: 'micro-character',
            script: 'dist/src/main.js',
            watch: ["dist/src/microservice/character", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'microservice/character'
            }
        },
        {
            name: 'micro-stats',
            script: 'dist/src/main.js',
            watch: ["dist/src/microservice/stats", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'microservice/stats'
            }
        },
        {
            name: 'micro-quest',
            script: 'dist/src/main.js',
            watch: ["dist/src/microservice/quest", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'microservice/quest'
            }
        },
        {
            name: 'micro-account',
            script: 'dist/src/main.js',
            watch: ["dist/src/microservice/account", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'microservice/account'
            }
        },
        {
            name: 'micro-item',
            script: 'dist/src/main.js',
            watch: ["dist/src/microservice/item", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'microservice/item'
            }
        },
        {
            name: 'micro-map',
            script: 'dist/src/main.js',
            watch: ["dist/src/microservice/map", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'microservice/map'
            }
        },
        {
            name: 'server-presence',
            script: 'dist/src/main.js',
            watch: ["dist/src/server/presence", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'server/presence'
            }
        },
        {
            name: 'server-shard',
            script: 'dist/src/main.js',
            instances: 2,
            exec_mode: 'cluster',
            watch: ["dist/src/server/shard", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'server/shard',
                SHARD_PORT: '3002'
            }
        },
        {
            name: 'server-lobby',
            script: 'dist/src/main.js',
            watch: ["dist/src/server/lobby", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'server/lobby'
            }
        }
    ]
};
