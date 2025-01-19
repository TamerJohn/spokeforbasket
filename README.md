GET /all -> returns all the basket_addreses of baskets
POST /new -> create new basket and returns the basket_address
ANY /:basket_address -> records the requests, returns 200
GET /:basket_address/web -> get all the recorded requests
DELETE /:basket_address/web -> delete basket
