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

  async basketExists(basketAddress) {
    const sql = 'SELECT 1 FROM baskets WHERE basket_address = $1'
    let response = await this.query(sql, basketAddress)
    return response.length === 1
  }

  async getRequests(basketAddress) {
    const sql = 'SELECT headers, path, query_params, timestamp, body, method FROM requests WHERE basket_address = $1'
    let response = await this.query(sql, basketAddress)
    return response
  }

  async createBasket(basketAddress) {
    const sql = 'INSERT INTO baskets (basket_address) VALUES ($1)'
    await this.query(sql, basketAddress)
  }

  async deleteBasket(basketAddress) {
    const sql = 'DELETE FROM baskets (basket_address) WHERE basket_address = $1'
    let response = await this.query(sql, basketAddress)
    return response
  }

  async getAllBaskets() {
    const sql = 'SELECT basket_address FROM baskets'
    let response = await this.query(sql)
    return response  
  }

  async createRequest(basketAddress, headers, path, query_params, body, method) {
    const sql = 'INSERT INTO requests (basket_address, headers, path, query_params, body, method) VALUES ($1, $2, $3, $4, $5, $6)'
    let response = await this.query(sql, basketAddress, headers, path, query_params, body, method)
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
