var express = require("express");
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var logger = require("morgan");
var cookieParser = require('cookie-parser');
var nofavicon =require('no-favicon');
var app = express();

var routes = require('./routes/index');
var products = require('./routes/products');
var data = require('./routes/data');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(nofavicon());
app.get('/favicon.ico',function(req,res) {
  res.send();
});
app.use('/', routes);
app.use('/product', products);
app.use('/data', data);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error');
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error');
});


exports = module.exports = app;