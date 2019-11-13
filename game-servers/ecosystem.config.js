module.exports = {
    apps: [
        {
            name: 'builder',
            script: 'npm run build -- --watch',
            watch: false
        },
        {
            name: 'game-account',
            script: 'npm run start:prod',
            watch: ["dist"],
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
            name: 'game-register',
            script: 'npm run start:prod',
            watch: ["dist"],
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
            name: 'game-map',
            script: 'npm run start:prod',
            watch: ["dist"],
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
            name: 'game-shard',
            script: 'npm run start:prod',
            watch: ["dist"],
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
            name: 'game-lobby',
            script: 'npm run start:prod',
            watch: ["dist"],
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
