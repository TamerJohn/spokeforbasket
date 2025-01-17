const express = require('express')
require('dotenv').config()

const database = require('database_persistance').DatabasePersistence
const app = express()

app.use(express.json())

app.all('/:basket_address/web', (req, res) => {
  //Should record the incoming requests to database, IF there's corresponding basket_address 

  // INSERT INTO requests (basket_address, headers, path, query_params, body) VALUES (basket_address, ...)
})

app.get('/:basket_address', (req, res) => {
  // Return all requests from a basket of matching basket_address 

  // SELECT * FROM requests WHERE basket_address = :basket_address
})

app.get('/', (req, res) => { 

})

app.delete('/:basket_address/web', (req, res) => {

})

app.post('/new', (req, res) => {
  
})

const PORT =  process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server is running on ' + PORT);
});