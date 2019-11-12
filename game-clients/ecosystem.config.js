module.exports = {
    apps: [
        {
            name: 'game-client-watch',
            script: 'npm run build -- --base-href /game/ --watch'
        },
        {
            name: 'account-client-watch',
            script: 'npm run build -- --base-href /account/ --project account --watch'
        },
        {
            name: 'game-client',
            script: 'http-server dist -p 8080'
        }
    ]
};
