module.exports = {
    apps: [
        {
            name: 'server-world',
            script: 'dist/src/main.js',
            instances: 2,
            exec_mode: 'cluster',
            watch: ["dist/src/server/world", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'server/world',
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
