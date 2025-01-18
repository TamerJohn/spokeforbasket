const express = require('express')
const qs = require('qs')
const { v4: uuidv4 } = require('uuid')
const bodyParser = require('body-parser')

const db = require('./database_persistence').DatabasePersistence
const app = express()

app.use(express.json())
app.use(bodyParser.text({type: '*/*'}))

function generateAddress() {
  const uuid = uuidv4();
  return uuid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6); 
}

// app.use(express.static('dist'))
// app.use(bodyParser.text({type: '*/*'})) 

app.get('/:basket_address/web', (req, res) => {
  //Should record the incoming requests to database, IF there's corresponding basket_address 

  // INSERT INTO requests (basket_address, headers, path, query_params, body) VALUES (basket_address, ...)
})

app.all('/:basket_address', (req, res, next) => {
  let basket_address = req.params.basket_address

  if (basket_address !== 'basket_test') {
    next()
  }

  let headers = req.headers
  let path = req.path
  let query_params = qs.stringify(req.query)
  let method = req.method
  let body = req.body

  if (typeof body === "object") {
    if (Object.keys(body).length === 0) body = ''
  }

  // db.createRequest(basket_address, headers, path, query_params, body)
  res.status(200).send([basket_address, JSON.stringify(headers), path, query_params, body, method])
  // Return all requests from a basket of matching basket_address 

  // SELECT * FROM requests WHERE basket_address = :basket_address
})

app.get('/main', (req, res) => { 
  res.status(204).send('Welcome to Main Page')
})

app.delete('/:basket_address/web', (req, res) => {
  const basket_address = req.params.basket_address
  db.deleteBasket(basket_address)
  res.status(204).send(`Basket address ${basket_address} has been deleted`)
})

app.post('/new', (req, res) => {
  const basket_address = generateAddress()
  db.createBasket(basket_address)
  res.status(201).send(`Basket address ${basket_address} has been created`)
})

app.use((request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
})

const PORT =  process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server is running on ' + PORT);
});