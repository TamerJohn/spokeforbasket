const { Client } = require('pg');
require('dotenv').config();

// class DatabasePersistence {
//   constructor(logger) {
//     this.client = new Client({
//       database: '@@@@@@',
//     });
//     this.client.connect();
//     this.logger = logger;
//   }

//   async query(statement, ...params) {
//     this.logger.info(`${statement}: ${params}`);
//     const res = await this.client.query(statement, params);
//     return res;
//   }


// }

class DatabasePersistence {
  constructor(logger) {
    this.logger = logger;
  }

  async query(statement, ...params) {
    const client = new Client() // no need to pass anything to instantiate client, it'll check the env variable for missing config
    await client.connect()
    // this.logger.info(`${statement}: ${params}`);
    const res = await client.query(statement, params);
    client.end()
    return res.rows;
  }

  async getBasketRequests(basket_address) {
    const sql = 'SELECT headers, path, query_path, timestamp, body FROM requests WHERE basket_address = $1'
    let response = await this.query(sql, basket_address)
    return response
  }

  async createBasket(basket_address) {
    const sql = 'INSERT INTO baskets (basket_address) VALUES $1'
    let response = await this.query(sql, basket_address)
    return response
  }

  async deleteBasket(basket_address) {
    const sql = 'DELETE FROM baskets (basket_address) WHERE basket_address = $1'
    let response = await this.query(sql, basket_address)
    return response
  }

  async getAllRequests(basket_address) {
    const sql = 'SELECT * FROM requests WHERE basket_address = $1'
    let response = await this.query(sql, basket_address)
    return response
  }

  async createRequest(basket_address, headers, path, query_params, body) {
    const sql = 'INSERT INTO requests (basket_address, headers, path, query_params, body) VALUES ($1, $2, $3, $4, $5)'
    let response = await this.query(sql, basket_address, headers, path, query_params, body)
    return response
  }

  async deleteRequest(basket_address) {
    const sql = 'DELETE FROM requests (basket_address) WHERE basket_address = $1'
    let response = await this.query(sql, basket_address)
    return response
  }

  async test() {
    let result = await this.query("")
    console.log(result)
  }
}

let db = new DatabasePersistence()
db.getBasketRequests('test_basket')
// db.test()

// SELECT md5(random()::text);
module.exports = DatabasePersistence;

// const pg = require('pg')
// const { Client } = pg

// const psqlDatabasePing = async () => {
//   const client = new Client() // no need to pass anything to instantiate client, it'll check the env variable for missing config
//   await client.connect()
//   const res = await client.query('SELECT color FROM colors')
//   client.end()
//   return(res.rows)
// }


//   ("createdb basket")
//   ("createdb request")
//   ("psql -d basket < schema.sql")
//   ("psql -d requ < schema.sql")

// TODO
// - unique basket address generator
// - mongoDB
// - test with ngrok