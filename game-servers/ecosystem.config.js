module.exports = {
    apps: [
        {
            name: 'redis',
            script: 'redis-server',
            watch: false
        },
        {
            name: 'server-account',
            script: 'npm start',
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
            name: 'server-map',
            script: 'npm start',
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
            name: 'server-shard',
            script: 'npm start',
            watch: ["src/shard", "src/main.ts", "src/constants.ts", "src/lib", "lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'shard'
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
