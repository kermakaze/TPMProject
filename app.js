const app = require('express')();
const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
const sql = require('mssql');

const ConnectionString = require("mssql/lib/connectionstring");

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


app.get('/dashboard', async (req, res) => {

    let search_query = req.query.search_query;

    let ecData = await electoralCommisionpostgres.from('users')
        .where('full_name', 'like', `%${search_query}%`)
        .select();
    let iData = await immigrationServicemySql.from('users')
        .where('full_name', 'like', `%${search_query}%`)
        .select();
    let dvlaData = await dvlamssql.from('users')
        .where('full_name', 'like', `%${search_query}%`)
        .select();
    console.log(search_query)
    console.log(ecData)
    res.render('dashboard', {
        ecData: ecData,
        iData: iData,
        dvlaData: dvlaData,
        search_query: search_query


    })
});

app.get('/dvla', async (req, res) => {
    try {
        let people = await dvlamssql.from('users')
            .select();
        console.log(people);
        res.render('dvla', {people: people})
    } catch (e) {
        console.error(e);
        res.send('Unexpected error occurred');
    }

});

app.get('/electoral_commission', async (req, res) => {
    try {
        let people = await dvlamssql.from('users')
            .select();
        console.log(people);
        res.render('dvla', {people: people})
    } catch (e) {
        console.error(e);
        res.send('Unexpected error occurred');
    }
});

app.get('/immigration_service', async (req, res) => {
    try {
        let people = await immigrationServicemySql.from('users')
            .select();
        console.log(people)
        res.render('immigration', {people: people})
    } catch (e) {
        console.error(e);
        res.send('Unexpected error occurred');
    }
})


app.get('/populate_db', (req, res) => {

    immigrationServicemySql.schema.createTableIfNotExists("users", function (table) {
        table.increments(); // integer id

        // name
       // table.increments('id');
        table.string('full_name');
        table.string('nationality');
        table.date('dob');
        table.string('gender');
        table.string('passport_no');
        table.string('telephone');

    }).then(function () {
            console.log('successful created immigration pg table data');

        }
    )
        .catch(err => {
            console.error(err);
            console.error('Could not create pg database')
        });

    dvlamssql.schema.createTableIfNotExists("users", function (table) {
        table.increments(); // integer id

        // name
        // table.increments('id');
        table.string('full_name');
        table.string('nationality');
        table.date('dob');
        table.string('gender');
        table.string('license_no');
        table.string('license_type');
        table.string('telephone');

    }).then(function () {
            console.log('successful created dvla mssql table data');

        }
    )
        .catch(err => {
            console.error(err);
            console.error('Could not dvla mssql database')
        })

    electoralCommisionpostgres.schema.createTableIfNotExists("users", function (table) {
        table.increments(); // integer id

        // name
        // table.increments('id');
        table.string('full_name');
        table.string('nationality');
        table.date('dob');
        table.string('gender');
        table.string('voters_id');

        table.string('telephone');

    }).then(function () {
            console.log('successful created electoral postgres table data');

        }
    )
        .catch(err => {
            console.error(err);
            console.error('Could not electoral postgres database')
        })

});

app.listen(5000, () => {
    console.log('App listening on port 5000')
});






