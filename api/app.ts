import { Driver } from "./models/Driver";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// load drivers and extend with place
var drivers = require('./assets/data/drivers.json')
var places = Array.from(Array(drivers.length).keys());
drivers.forEach((driver: Driver) => {
  var place_index = Math.floor(Math.random()*places.length);
  driver.place = places[place_index] + 1;
  places.splice(place_index, 1);
})

var driversRouter = require('./routes/drivers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('drivers', drivers); 

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));

app.use('/drivers', driversRouter);

app.use('/images', express.static('images'));

// catch 404 and forward to error handler
app.use(function(req: any, res: any, next: any) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
