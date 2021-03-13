var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expHbs = require('express-handlebars');
var indexRouter = require('./routes/index');
var studentsRouter = require('./routes/students');

global.config = require("./config/config");
global.db = require("./models/index");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

/**
 * Loading Handlebar template and custom helpers
 */
const hbs = expHbs.create(require('./helpers/handlebars.js'));

// view engine setup
app.engine('hbs', hbs.engine);
app.set('view engine', "hbs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/students', studentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;