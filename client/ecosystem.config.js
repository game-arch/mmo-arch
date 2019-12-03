module.exports = {
    apps: [
        {
            name: 'client-game',
            script: 'npm run build --  --watch'
        },
        {
            name: 'clients-server',
            script: 'http-server dist -p 8080'
        }
    ]
};
