var config = require('../../config/config');
var mysql = require('mysql');
var mysqlConnectionPool = mysql.createPool(config.database.mysql);

module.exports = mysqlConnectionPool;