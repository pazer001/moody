var express = require('express');
var app = express();
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'c9j98y5t'
});

connection.connect();

app.get('/randomList', function (req, res) {
    const query     =   `SELECT * FROM moody.songs ORDER BY RAND() LIMIT 100`;
    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        res.send(rows);
    });
});

app.listen(80, function () {
    console.log('Example app listening on port 3000!');
});