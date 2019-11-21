const servers = require('./servers.config');
const microservices = require('./microservices.config');
const builder = require('./builders.config');
const apps = servers.apps.concat(microservices.apps).concat(builder.apps);
module.exports = {
    apps: apps
};
