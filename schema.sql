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
  headers text,
  path text,
  query_params text,
  timestamp timestamp(0) DEFAULT NOW(),
  body text
);

INSERT INTO baskets (basket_address) VALUES ('test_basket');

