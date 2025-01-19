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

async function basketExists(basketAddress) {
  // return basketAddress === 'test_basket'
  return await db.basketExists(basketAddress);
}

app.use(express.json())
app.use(bodyParser.text({type: '*/*'}))

app.get('/:basketAddress/web', async (req, res, next) => {
  let basketAddress = req.params.basketAddress

  let exists = await basketExists(basketAddress)
  if (!exists) {
    return next()
  }

  let requests = await db.getRequests(basketAddress)
  res.send(requests);
})

app.all('/:basketAddress', async (req, res, next) => {
  let basketAddress = req.params.basketAddress

  let exists = await basketExists(basketAddress)
  if (!exists) {
    return next()
  }

  let headers = req.headers
  let path = req.path
  let query_params = qs.stringify(req.query)
  let method = req.method
  let body = req.body

  if (headers['content-type'] !== 'application/json' && typeof body === "object") {
    body = ''
  }

  try {
    await db.createRequest(basketAddress, JSON.stringify(headers), path, query_params, body, method)
    res.status(204).send()
  } catch {
    res.status(500).send('You broke our server')
  }
})

// needs work
app.get('/main', (req, res) => { 
  res.status(204).send('Welcome to Main Page')
})

// needs work
app.delete('/:basketAddress/web', (req, res) => {
  const basketAddress = req.params.basketAddress
  db.deleteBasket(basketAddress)
  res.status(204).send(`Basket address ${basketAddress} has been deleted`)
})

app.post('/new', async (req, res) => {
  const basketAddress = generateAddress()
  try {
    await db.createBasket(basketAddress)
    res.status(201).send({address: basketAddress})
  } catch {
    res.status(500).send('Could not create new basket')
  }
})

app.use((request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
})

const PORT =  process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server is running on ' + PORT);
});