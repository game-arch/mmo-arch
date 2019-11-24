module.exports = {
    apps: [
        {
            name: 'global-lobby',
            script: 'dist/src/main.js',
            watch: ["dist/src/global/lobby", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'global/lobby'
            }
        },
        {
            name: 'global-account',
            script: 'dist/src/main.js',
            watch: ["dist/src/global/account", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'global/account'
            }
        },
        {
            name: 'global-presence',
            script: 'dist/src/main.js',
            watch: ["dist/src/global/presence", "dist/src/main.ts", "dist/src/constants.ts", "dist/src/lib", "dist/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'global/presence'
            }
        }
    ]
};
