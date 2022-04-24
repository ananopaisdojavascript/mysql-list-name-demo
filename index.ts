import mysql from "mysql";
import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
require('dotenv').config();

const app = express();
const port = process.env.PORT

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
});

db.connect(function (err) {
    if (err) throw err;
    console.log("Até que enfim conectou!!!!!");
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/names', (request: Request, response: Response) => {
    const query = 'SELECT * FROM nameList';
    db.query(query, (error, results, fields: any) => {
        if (error) throw error;
        response.send(JSON.stringify(results));
    })
})

app.get('/names/:id', (request: Request, response: Response) => {
    const id = request.params.id;
    const query = `SELECT * FROM nameList WHERE id = ${id}`;
    db.query(query, (error, results, fields: any) => {
        if (error) throw error;
        response.send(JSON.stringify(results));
    })
})

app.listen(port, () => {
    console.log(`Servidor funcionando na porta ${port}`)
})