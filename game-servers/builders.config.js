module.exports = {
    apps: [
        {
            name: '_builder',
            script: 'npm run build -- --watch',
            watch: false
        }
    ]
};
