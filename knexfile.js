// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
 module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://postgres:docker@localhost:5432/capstone'
  },

  staging: {
    client: 'pg',
    connection:'postgres://postgres:docker@localhost:5432/capstone',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
   
   
   client: 'pg',
    debug: true,
    connection: 'postgres://ksiqbcqujvgwbn:77f9cedb6bcb42e9060de88b72e29418ab7b709e05675a76e4fc4ef78913f55d@ec2-54-173-77-184.compute-1.amazonaws.com:5432/d1f9ab1ufksiac',
    ssl: true,
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
