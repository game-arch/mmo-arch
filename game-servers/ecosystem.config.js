module.exports = {
    apps: [
        {
            name: 'redis',
            script: 'redis-server',
            watch: false
        },
        {
            name: 'micro-account',
            script: 'index.js',
            instances: 2,
            exec_mode: 'cluster',
            watch: ["src/account", "src/main.ts", "src/constants.ts", "src/lib", "lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'account'
            }
        },
        {
            name: 'micro-map',
            script: 'index.js',
            instances: 2,
            exec_mode: 'cluster',
            watch: ["src/map", "src/main.ts", "src/constants.ts", "src/lib", "lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'map'
            }
        },
        {
            name: 'server-register',
            script: 'npm start',
            watch: ["src/register", "src/main.ts", "src/constants.ts", "src/lib", "lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'register'
            }
        },
        {
            name: 'server-shard',
            script: 'index.js',
            instances: 2,
            exec_mode: 'cluster',
            watch: ["src/shard", "src/main.ts", "src/constants.ts", "src/lib", "lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'shard',
                SHARD_PORT: '3002'
            }
        },
        {
            name: 'server-lobby',
            script: 'npm start',
            watch: ["src/lobby", "src/main.ts", "src/constants.ts", "src/lib", "lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'lobby'
            }
        }
    ]
};
