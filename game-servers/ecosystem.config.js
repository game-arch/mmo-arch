module.exports = {
    apps: [
        {
            name: 'game-lobby',
            script: 'nest start --watch',
            env: {
                SERVER_TYPE: 'lobby',
                PORT: '3000'
            }
        },
        {
            name: 'game-account',
            script: 'nest start --watch',
            env: {
                SERVER_TYPE: 'account',
                PORT: '3001'
            }
        },
        {
            name: 'game-register',
            script: 'nest start --watch',
            env: {
                SERVER_TYPE: 'register',
                PORT: '3002'
            }
        },
        {
            name: 'game-map',
            script: 'nest start --watch',
            env: {
                SERVER_TYPE: 'map',
                PORT: '3003'
            }
        },
        {
            name: 'game-shard-1',
            script: 'nest start --watch',
            env: {
                SERVER_TYPE: 'shard',
                PORT: '3004'
            }
        },
        {
            name: 'game-shard-2',
            script: 'nest start --watch',
            env: {
                SERVER_TYPE: 'shard',
                PORT: '3005'
            }
        },
        {
            name: 'game-shard-3',
            script: 'nest start --watch',
            env: {
                SERVER_TYPE: 'shard',
                PORT: '3006'
            }
        },
        {
            name: 'game-shard-4',
            script: 'nest start --watch',
            env: {
                SERVER_TYPE: 'shard',
                PORT: '3007'
            }
        }
    ]
};
