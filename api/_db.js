const sql = require('mssql');

let pool;
module.exports = async function getDb() {
  if (!pool) {
    pool = await sql.connect(process.env.SQL_CONNECTION_STRING);
  }
  return pool;
};
