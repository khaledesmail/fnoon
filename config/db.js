var mysql = require('mysql2');
var pool = mysql.createPool({
  host: 'mano-ad.com',
  user: 'mano',
  password: 'sdfdsfdf565tfe',
  database: 'mano_fnon'
});

const query = (query, cb = () => {}) => {
  pool.getConnection((err, connection) => {
    if (err) {
      cb(err);
    }
    connection.query(query, (err, results) => {
      connection.release();
      cb(err, results);
    });
  });
};

pool.on('connection', function() {
  console.log('mysql connected');
});

const obj = {
  query,
};

module.exports = obj;
