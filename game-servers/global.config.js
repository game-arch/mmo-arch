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
        },
        {
            name:  'global-character',
            script: 'dist/src/main.js',
            watch: ["dist/src/global/character", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'global/character'
            }
        },
        {
            name:  'global-item',
            script: 'dist/src/main.js',
            watch: ["dist/src/global/item", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'global/item'
            }
        },
        {
            name:  'global-quest',
            script: 'dist/src/main.js',
            watch: ["dist/src/global/quest", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'global/quest'
            }
        },
        {
            name:  'global-chat',
            script: 'dist/src/main.js',
            watch: ["dist/src/global/chat", "dist/src/main.js", "dist/src/constants.js", "dist/lib", "dist/src/lib"],
            // Delay between restart
            watch_delay: 1000,
            watch_options: {
                "followSymlinks": false
            },
            env: {
                SERVER_TYPE: 'global/chat'
            }
        }
    ]
};
