// NodeJS Initial Setting.
const express = require("express");
const app = express();
const port = 8080;

// MySQL Initial Setting.
const mysql = require('mysql');
const dbconfig = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);

connection.connect();

// NodeJS Start.
app.get("/", (req, res) => {
    res.send("Hello World!")
});

app.get('/users', (req, res) => {
    connection.query('SELECT * FROM Users', (error, rows, fields) => {
        if (error) throw error;
        console.log('User info is: ', rows);
        res.send(rows);
    });

    connection.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`));