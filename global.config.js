module.exports = {
    apps: [
        {
            instances: 1,
            name: 'global-lobby',
            script: 'dist/nest/global/lobby/main.js',
            watch: ['dist/nest/global/lobby', 'dist/nest/lib'],
            watch_options: {
                'followSymlinks': false
            }
        },
        {
            instances: 1,
            name: 'global-account',
            script: 'dist/nest/global/account/main.js',
            watch: ['dist/nest/global/account', 'dist/nest/lib'],
            watch_options: {
                'followSymlinks': false
            }
        },
        {
            name: 'global-presence',
            script: 'dist/nest/global/presence/main.js',
            watch: ['dist/nest/global/presence', 'dist/nest/lib'],
            watch_options: {
                'followSymlinks': false
            }
        }

    ]
}
