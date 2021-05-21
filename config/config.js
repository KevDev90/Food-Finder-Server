require('dotenv').config;

module.exports = {
  development: {
    username: 'woiwcddofmraiv',
    password: '85c76f9826fc05c4a21d3f684784571d0800ab1bddbfbe92f58b519315e73148',
    database: 'dbdqjmqv3nccsn',
    host: 'ec2-35-174-35-242.compute-1.amazonaws.com',
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
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
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
  }
}