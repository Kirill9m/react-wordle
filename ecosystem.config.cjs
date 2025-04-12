module.exports = {
  apps : [{
    name        : "Wordle",
    script      : "backend/index.js",
    interpreter : "node",
    interpreter_args: "--experimental-modules",
    watch       : true,
    env: {
      NODE_ENV: "development",
      PORT: 5080
    },
    env_production : {
      NODE_ENV: "production",
      PORT: 5080
    }
  }]
};