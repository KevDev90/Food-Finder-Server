require('dotenv').config;

module.exports = {
  development: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
  },
  test: {
    username: process.env.PGUSER_TEST,
    password: process.env.PG_PASSWORD_TEST,
    database: process.env.PG_DB_TEST,
    host: process.env.PG_DB_HOST,
    dialect: 'postgres'
  },
  production: {
    use_environment_variable: 'DATABASE_URL',
    dialect: 'postgres'
  }
}