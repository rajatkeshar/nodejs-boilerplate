require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const http = require('http').Server(app);
global.appDir = path.dirname(require.main.filename);

const auth = require('./lib/auth')();

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));


/* Defining middleware */
app.use((req, res, next)=> {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

app.use(function(req, res, next) {
	next();
});

/* loading all routes */
try {
    require('./routesLoder')(app, http);
} catch (error) {
    console.log('error', error);
}

app.listen(process.env.PORT, (request, response)=> {
	console.log(`running at port: ${process.env.PORT}`);
});

//module.exports = app;
