module.exports = {
  apps: [
    {
      instances: 1,
      name: "global-lobby",
      script: "dist/services/global/lobby/main.js",
      watch: ["dist/services/global/lobby", "dist/lib"],
      watch_options: {
        "followSymlinks": false
      }
    },
    {
      instances: 1,
      name: "global-account",
      script: "dist/services/global/account/main.js",
      watch: ["dist/services/global/account", "dist/lib"],
      watch_options: {
        "followSymlinks": false
      }
    },
    {
      name: "global-presence",
      script: "dist/services/global/presence/main.js",
      watch: ["dist/services/global/presence", "dist/lib"],
      watch_options: {
        "followSymlinks": false
      }
    },
    {
      instances: 1,
      name: (process.env.WORLD_CONSTANT || "maiden") + "-character",
      script: "dist/services/local/character/main.js",
      watch: ["dist/services/local/character", "dist/lib"],
      env: {
        WORLD_CONSTANT: process.env.WORLD_CONSTANT,
        WORLD_NAME: process.env.WORLD_NAME
      },
      watch_options: {
        "followSymlinks": false
      }
    },
    {
      instances: 1,
      name: (process.env.WORLD_CONSTANT || "maiden") + "-party",
      script: "dist/services/local/party/main.js",
      watch: ["dist/services/local/party", "dist/lib"],
      env: {
        WORLD_CONSTANT: process.env.WORLD_CONSTANT,
        WORLD_NAME: process.env.WORLD_NAME
      },
      watch_options: {
        "followSymlinks": false
      }
    },
    {
      instances: 2,
      name: (process.env.WORLD_CONSTANT || "maiden") + "-server",
      script: "dist/services/local/world/main.js",
      watch: ["dist/services/local/world", "dist/lib"],
      env: {
        WORLD_CONSTANT: process.env.WORLD_CONSTANT,
        WORLD_NAME: process.env.WORLD_NAME
      },
      watch_options: {
        "followSymlinks": false
      }
    },
    {
      instances: 1,
      name: (process.env.WORLD_CONSTANT || "maiden") + "-map",
      script: "dist/services/local/map/main.js",
      watch: ["dist/services/local/map", "dist/lib"],
      env: {
        WORLD_CONSTANT: process.env.WORLD_CONSTANT,
        WORLD_NAME: process.env.WORLD_NAME
      },
      watch_options: {
        "followSymlinks": false
      }
    }
  ]
};
