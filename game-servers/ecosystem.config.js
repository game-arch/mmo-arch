module.exports = {
    apps: [
        {
            name: 'redis',
            script: 'redis-server',
            watch: false
        },
        {
            name: 'server-builder',
            script: 'npm run build -- --watch',
            watch: false
        },
        {
            name: 'server-account',
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
            name: 'server-register',
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
            name: 'server-map',
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
            name: 'server-shard',
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
            name: 'server-lobby',
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
