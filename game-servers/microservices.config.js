module.exports = {
    apps: [
        {
            name: 'micro-ai',
            script: 'dist/src/main.js',
            watch: ["dist/src/microservice/ai", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'microservice/ai'
            }
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
            name: 'micro-area',
            script: 'dist/src/main.js',
            watch: ["dist/src/microservice/area", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'microservice/area'
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
            name: 'micro-presence',
            script: 'dist/src/main.js',
            watch: ["dist/src/microservice/presence", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'microservice/presence'
            }
        },
        {
            name: 'micro-physics',
            script: 'dist/src/main.js',
            instances: '2',
            exec_mode: 'cluster',
            watch: ["dist/src/microservice/physics", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'microservice/physics'
            }
        }
    ]
};
