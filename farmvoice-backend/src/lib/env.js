require('dotenv').config();

function getEnv(name, fallback = '') {
  return process.env[name] || fallback;
}

module.exports = { getEnv };