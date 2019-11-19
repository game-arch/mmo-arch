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
            name: 'micro-account',
            script: 'dist/src/main.js',
            instances: 2,
            exec_mode: 'cluster',
            watch: ["dist/src/account", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
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
            script: 'dist/src/main.js',
            instances: 2,
            exec_mode: 'cluster',
            watch: ["dist/src/map", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
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
            name: 'server-presence',
            script: 'dist/src/main.js',
            watch: ["dist/src/presence", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'presence'
            }
        },
        {
            name: 'server-shard',
            script: 'dist/src/main.js',
            instances: 2,
            exec_mode: 'cluster',
            watch: ["dist/src/shard", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
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
            script: 'dist/src/main.js',
            watch: ["dist/src/lobby", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
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
