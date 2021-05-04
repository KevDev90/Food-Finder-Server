const { Pool } = require("pg");
require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const pool = new Pool(
  {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: true
  }
);
module.exports = {
  query: (text, params) => pool.query(text, params),
};