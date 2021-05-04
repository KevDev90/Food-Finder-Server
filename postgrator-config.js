require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED=0
const pg = require('pg');


module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')
     ? process.env.TEST_DATABASE_URL
     : process.env.DATABASE_URL,
}
