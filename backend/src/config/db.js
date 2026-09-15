const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false, // lokal SQL Server üçün
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('SQL Server-ə qoşuldu');
    return pool;
  })
  .catch((err) => {
    console.error('SQL Server bağlantı xətası:', err.message);
    throw err;
  });

module.exports = { sql, poolPromise };
