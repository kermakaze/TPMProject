/*
require('dotenv').config();
const app = require('express')();
var mysql = require('mysql');
const { Client } = require('pg')
const client = new Client()
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});

con.connect(function(err) {
    if (err) throw err;
    console.log("MySql Connected!");
    /!*con.query("CREATE DATABASE mydb", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });*!/
});


async function connectPostgres(){

    await client.connect()

    const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    console.log(res.rows[0].message) // Hello world!
    await client.end()

}

const sql = require('mssql')

async function connectMssql(){
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect('mssql://username:password@localhost/master')
        const result = await sql.query`CREATE DATABASE hello`
        console.dir(result)
    } catch (err) {
        // ... error checks

        console.error(err);
    }
}
connectMssql();

connectPostgres();



app.get('/hi',(req, res)=>{
    res.send(('hello'))
})

app.listen(5000,()=>{
    console.log('App listening on Port 5000');
})


*/
const immigrationServicemySql = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'GIS'
    }
});

const electoralCommisionpostgres = require('knex')({
    client: 'postgres',
    connection: 'postgres://postgres:0icBf6np5iKC8wKz@localhost:5432/postgres',

});

const dvlamssql = require('knex')({
    client: 'mssql',
    server : 'localhost',
    user : 'sa',
    password : 'pwd',
    database:'Test',
    options: {
        port: 1433

    }});

/*
dvlamssql.raw('SELECT 1+1 as name')
    .then(res => {
        console.log("Successfully connected to MSSql of DVLA")
    })
    .catch(err => {
        console.error("Cannot connect to MSSql of DVLA");
        console.error(err);
        process.exit(1);
    });*/

immigrationServicemySql.raw('SELECT 1+1 as result')
    .then(res => {
        console.log("Successfully connected to MySql of Immigration Service ")
    })
    .catch(err => {
        console.error("Cannot connect to MySql of Immigration Service");
        console.error(err);
        process.exit(1);
    });

electoralCommisionpostgres.raw('SELECT 1+1 as result')
    .then(res => {
        console.log("Successfully connected to Postgres of Electoral Commission")
    })
    .catch(err => {
        console.error("Cannot connect to Postgres of Electoral Commission");
        console.error(err);
        process.exit(1);
    });





