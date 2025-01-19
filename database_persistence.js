const { Client } = require('pg');
require('dotenv').config();

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

  async basketExists(basket_address) {
    const sql = 'SELECT 1 FROM baskets WHERE basket_address = $1'
    let response = await this.query(sql, basket_address)
    return response.length === 1
  }

  async getRequests(basket_address) {
    const sql = 'SELECT headers, path, query_params, timestamp, body, method FROM requests WHERE basket_address = $1'
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

  // prolly don't need getRequests and getAllRequests tbh
  // async getAllRequests(basket_address) {
  //   const sql = 'SELECT headers, path, query_params, timestamp, body, method FROM requests WHERE basket_address = $1'
  //   let response = await this.query(sql, basket_address)
  //   return response  
  // }

  async createRequest(basket_address, headers, path, query_params, body, method) {
    const sql = 'INSERT INTO requests (basket_address, headers, path, query_params, body, method) VALUES ($1, $2, $3, $4, $5, $6)'
    let response = await this.query(sql, basket_address, headers, path, query_params, body, method)
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

// let db = new DatabasePersistence()
// db.basketExists('test_basket')

module.exports.DatabasePersistence = DatabasePersistence
