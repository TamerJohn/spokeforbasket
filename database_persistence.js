const { Client } = require('pg');

class DatabasePersistence {
  constructor(logger) {
    this.client = new Client({
      database: '@@@@@@',
    });
    this.client.connect();
    this.logger = logger;
  }

  async query(statement, ...params) {
    this.logger.info(`${statement}: ${params}`);
    const res = await this.client.query(statement, params);
    return res;
  }


}


module.exports = DatabasePersistence;

// const pg = require('pg')

// const { Client } = pg
// const client = new Client() // no need to pass anything to instantiate client, it'll check the env variable for missing config

// const psqlDatabasePing = async () => {
//   const client = new Client()
//   await client.connect()
//   const res = await client.query('SELECT color FROM colors')
//   client.end()
//   return(res.rows)
// }


// 1. Working PSQL database.
// 2. Routing
// 3. MongoDB