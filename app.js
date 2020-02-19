const app = require('express')();
const express = require('express');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
require('dotenv').config();

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
const sql = require('mssql')
const ConnectionString = require("mssql/lib/connectionstring");

/*async function connectMssql(){
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect('mssql://sa:pwd@localhost/master')
        const result = await sql.query`CREATE DATABASE hello`
        console.dir(result)
    } catch (err) {
        // ... error checks

        console.error(err);
    }
}*/
//connectMssql();
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
    user: 'sa',
    password: 'pwd',
    server: 'localhost',
    database: 'dvla',
    connection: ConnectionString.resolve(`mssql://sa:pwd@localhost:1433/dvla`),
});


dvlamssql.raw('SELECT 1+1 as name')
    .then(res => {
        console.log("Successfully connected to MSSql of DVLA")
    })
    .catch(err => {
        console.error("Cannot connect to MSSql of DVLA");
        console.error(err);
        process.exit(1);
    });


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


app.get('/dashboard', (req, res) => {
    res.render('dashboard', {})
});

app.get('/dvla', async (req, res) => {
    try {
        let people = await dvlamssql.from('people')
            .select();
        console.log(people)
        res.render('dvla', {people: people})
    } catch (e) {
        console.error(e);
        res.send('Unexpected error occurred');
    }

});

app.get('/electoral_commission', (req, res) => {
    res.render('', {})
});

app.get('/immigration_service', (req, res) => {
    res.render('', {});
})


/*app.get('/populate_db', (req, res) => {
    immigrationServicemySql.schema.createTableIfNotExists("payment_paypal_status", function (table) {
        table.increments(); // integer id

        // name
        table.string('name');

        //description
        table.string('description');
    }).then(function () {
            immigrationServicemySql("payment_paypal_status").insert([
                {name: "A", description: "A"},
                {name: "B", description: "BB"},
                {name: "C", description: "CCC"},
                {name: "D", description: "DDDD"}
            ]);

            console.log('successful')
        }
    )
        .then(()=>{
            console.log('added data')
        })
        .catch(err=> {
            console.error(err)
        })
})*/

app.listen(5000, () => {
    console.log('App listening on port 5000')
});






