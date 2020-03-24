module.exports = {
    apps: [
        {
            name: 'server.builder',
            script: 'npm run build:server -- --watch',
            watch: false
        }
    ]
}
