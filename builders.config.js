module.exports = {
  apps: [
    {
      name: "_builder",
      script: "npm run build:server -- --watch",
      watch: false
    }
  ]
};
