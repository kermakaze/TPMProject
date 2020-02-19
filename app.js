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
    connection: 'postgres://postgres:0icBf6np5iKC8wKz@localhost:5432/gis',

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

app.get('/immigration_service', async (req, res) => {
    try {
        let people = await immigrationServicemySql.from('users')
            .select();
        console.log(people)
        res.render('dvla', {people: people})
    } catch (e) {
        console.error(e);
        res.send('Unexpected error occurred');
    }
})


app.get('/populate_db', (req, res) => {

    immigrationServicemySql.schema.createTableIfNotExists("users", function (table) {
        table.increments(); // integer id

        // name
        table.increments('id');
        table.string('full_name');
        table.string('nationality');
        table.date('dob');
        table.string('gender');
        table.string('passport_no');
        table.string('telephone');

        //description
       // table.string('description');
        return immigrationServicemySql("users").insert([
            {full_name: "A",
                nationality: "Ghanaian",
            dob: '6/10/98',
            gender: 'Male',
            passport_no: '199999',
            telephone: '0552587984'},

        ]);
    }).then(function () {
            console.log('successful created immigration pg table data');

        }
    )
        .then(()=>{
            console.log('Added users')
        })
        .catch(err => {
            console.error(err);
            console.error('Could not create pg database')
        })

});

app.listen(5000, () => {
    console.log('App listening on port 5000')
});






