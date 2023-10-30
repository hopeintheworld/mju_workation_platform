// NodeJS Initial Setting.
const express = require("express");
const cors = require("cors");
require('dotenv').config(); // 환경변수 모듈 process.env.
const app = express();

app.use(express.json()); // Body-Parser 대용, Express에 body-parser가 내장됨.
app.use(cors());

// Swagger Setting
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    "openapi" : "3.0.0",
    "info" : {
        "version" : "1.0.0",
        "title" : "MJU Workation Platform",
        "description" : "2023 명지대학교 캡스톤디자인 4조 백엔드",
    },
    "host" : process.env.DOMAIN,
    "basePath": "/api/",
    "paths": { },
    "definitions": { },
    "responses": { },
    "parameters": { },
    "securityDefinitions": {
      "bearerAuth": {
        "name": "Authorization",
        "in": "header",
        "type": "apiKey",
        "schema": "bearer",
        "bearerFormat": "JWT",
      }
    }
};

const options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./app/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDefinition));

// MySQL Initial Setting.
const mysql = require('mysql');
const dbconfig = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);

connection.connect((err) => {
    if (err) throw err;
    console.log("[SUCCESS] MySQL Connected.");
});

// DB 존재 여부 확인.
connection.query(`USE ${process.env.DB_DATABASE}`, (err) => {
    if(err) {
        connection.query(`CREATE DATABASE ${process.env.DB_DATABASE}`,(err, result) => {
            if (err) throw err;
            console.log("[SUCCESS] DATABASE Created");
            connection.query(`USE ${process.env.DB_DATABASE}`);
            console.log(`[SUCCESS] USE ${process.env.DB_DATABASE}`)
            connection.query('CREATE TABLE IF NOT EXISTS Users (user_id INT(10) NOT NULL, kakao_email VARCHAR(50) NOT NULL, name VARCHAR(50), category_1 INT(10), category_2 INT(10), category_3 INT(10), gender BOOL, PRIMARY KEY (user_id));', (err, result) => {
                if (err) throw err;
                console.log("[SUCCESS] TABLE Users Created.")
                connection.query("INSERT INTO Users (user_id, kakao_email, name, category_1, category_2, category_3, gender) VALUES (1, 'admin', 'admin', 0, 0, 0, TRUE);", (err, result) => {
                    if (err) throw err;
                    console.log("[SUCCESS] User Admin Created");
                });
            });
        });
    }
});

const port = process.env.PORT;

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