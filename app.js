var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var session = require('express-session');

var routes = require('./routes/index');
<<<<<<< Updated upstream
var dimensionRouter = require('./routes/dimensions');
var measuresRouter = require('./routes/measures');
var namespaceRouter = require('./routes/logdata');
=======

var configRoute = require('./routes/config');
var serviceConfigRoute = require('./routes/serviceConfig');
var authenticate = require('./routes/authenticate')(passport);
var userAgent = require('./routes/nginx/userAgent');
var logListing = require('./routes/nginx/logListing');
var trafficRate = require('./routes/nginx/trafficRate');

//Wave 2 code
var packageRoutes = require('./routes/aptCache/packageCount');
var graphRoutes = require('./routes/aptCache/logRateData');
var dataRateData = require('./routes/aptCache/dataRateData');
var packageAnalytics = require('./routes/aptCache/packageAnalytics');
var repRoutes = require('./routes/aptCache/repository');
var getInfo = require('./routes/aptCache/getInfo');
//end wave 2 code

//wave 3 routes starts
var getFilterData = require('./routes/gitLog/getFilterData');
var newfilter = require('./routes/gitLog/newfilter');
var plotTheGraph = require('./routes/gitLog/plot_the_graph');
var getProfile = require('./routes/gitLog/getProfile');
var getDashBoardJson = require('./routes/gitLog/getDashBoardJson');
var onPageLoadDashBoard = require('./routes/gitLog/onPageLoadDashBoard');
var gitDashboardConfigData  = require('./routes/gitLog/gitDashboardConfigData');
//wave 3 routes ends

//wave 4 starts
var expressions=require('./routes/realTimeLogs/queryBuilder/expressions.js')
//wave 4 ends
>>>>>>> Stashed changes
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'secret',
  cookie: {
    login: false
  }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', routes);
app.use('/dimensions', dimensionRouter);
app.use('/measures', measuresRouter);
app.use('/logdata', namespaceRouter);

//wave 4 code
app.use('/exp',expressions);

// wave 4 code ends

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
    // res.render('error');
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  // res.render('error');
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
