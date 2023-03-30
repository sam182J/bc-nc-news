const { Pool } = require("pg");
const dotenv = require("dotenv");
const ENV = process.env.NODE_ENV || "development";

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        max: 2,
      }
    : {};

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

const PGDATABASE = process.env.PGDATABASE;

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE not set");
}

module.exports = new Pool();
module.exports = new Pool(config);
