const express = require('express')
const qs = require('qs')
const { v4: uuidv4 } = require('uuid')
const bodyParser = require('body-parser')
const DatabasePersistence = require('./database_persistence').DatabasePersistence

const db = new DatabasePersistence()
const app = express()

function generateAddress() {
  const uuid = uuidv4();
  return uuid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6); 
}

function basketExists(basket_address) {
  return basket_address === 'test_basket'
}

app.use(express.json())
app.use(bodyParser.text({type: '*/*'}))

app.get('/:basket_address/web', (req, res, next) => {
  let basket_address = req.params.basket_address

  if (!basketExists(basket_address)) {
    next()
  }

  db.getRequests(basket_address).then(rows => {
    res.send(rows);
  })
})

//Should record the incoming requests to database, IF there's corresponding basket_address 

// INSERT INTO requests (basket_address, headers, path, query_params, body) VALUES (basket_address, ...)
app.all('/:basket_address', (req, res, next) => {
  let basket_address = req.params.basket_address

  if (!basketExists(basket_address)) {
    next()
  }

  let headers = req.headers
  let path = req.path
  let query_params = qs.stringify(req.query)
  let method = req.method
  let body = req.body

  if (headers['content-type'] !== 'application/json' && typeof body === "object") {
    body = ''
  }

  db.createRequest(basket_address, JSON.stringify(headers), path, query_params, body, method)
    .then(_ => {
      res.status(204).send()
    })
    .catch(_ => {
      res.status(500).send('Congratulations, you broke our server')
    })
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