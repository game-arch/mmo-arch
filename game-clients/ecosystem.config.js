module.exports = {
    apps: [
        {
            name: 'client-game',
            script: 'npm run build -- --base-href /game/ --watch'
        },
        {
            name: 'client-portal',
            script: 'npm run build -- --base-href /portal/ --project portal --watch'
        },
        {
            name: 'clients-server',
            script: 'http-server dist -p 8080'
        }
    ]
};
