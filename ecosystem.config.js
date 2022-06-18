module.exports = {
  apps : [{
    name   : "administrare",
    script : "./dist/server/main.js",
    env_production: {
       NODE_ENV: "production"
    },
    env_development: {
       NODE_ENV: "development"
    }
  }]
}
