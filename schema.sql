DROP DATABASE baskets;
CREATE DATABASE baskets;
\c baskets;

CREATE TABLE baskets (
  basket_id serial PRIMARY KEY,
  basket_address text NOT NULL UNIQUE
);

CREATE TABLE requests (
  basket_id serial PRIMARY KEY,
  basket_address text NOT NULL REFERENCES baskets (basket_address) ON DELETE CASCADE,
  headers text NOT NULL,
  path text NOT NULL,
  query_params text NOT NULL,
  timestamp timestamp(0) DEFAULT NOW() NOT NULL,
  body text,
  method text NOT NULL
);

INSERT INTO baskets (basket_address) VALUES ('test_basket');
INSERT INTO requests (basket_id, basket_address, headers, path, query_params, body, method) VALUES (1, 'test_basket', 'header text here', 'path here', 'query_arams here', 'body here', 'TEST_METHOD');

