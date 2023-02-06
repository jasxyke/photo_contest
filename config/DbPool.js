const mysql = require('mysql');
const config = require('../config/database');

dbPool = mysql.createPool({
    connectionLimit: 100,
    host: config.host,
    user: config.user,
    password: config.pass,
    database: config.name,
    port: config.port
});

module.exports = dbPool;

