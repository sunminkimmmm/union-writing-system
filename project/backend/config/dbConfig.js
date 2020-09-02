var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: "root",
    password: "",
    database: "union_writing_system"
})

module.exports = pool