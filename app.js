var createError = require('http-errors');
var express = require('express');
var finale = require('finale-rest');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const nunjucks = require('nunjucks');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dbTestConnectionRouter = require('./routes/db-test-connection');
//var bodyParser = require('body-parser');

var database = require('./db/connect');

var app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set('view engine', 'njk');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/db.test.connection', dbTestConnectionRouter);

// Initialize finale
finale.initialize({
  app: app,
  sequelize: database
});

// Create REST resource
var Issue = require('./db/models/Issue');

var issueResource = finale.resource({
  model: Issue,
  endpoints: ['/api/issues', '/api/issues/:id']
});

database.sync({ 
	force: false 
});

module.exports = app;