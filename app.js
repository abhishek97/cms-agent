var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const session = require('express-session');
const config = require('./config');
const rp = require('request-promise');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret :  config.secret || 'SecretStringHere' }))

app.use('/', index);
app.use('/users', users);

app.get('/login', (req,res)=>{
  res.render('login');
});

app.post('/login', (req,res)=>{

  let session = req.session;

  console.log(req.body);

  const options = {
    method : 'POST',
    uri: config.api + '/login',
    body  : req.body,
    json : true
  };

  rp(options).then(result=>{
    console.log(result);
    req.session.userId = result.userId;
    req.session.apiKey = result.apiKey;
    req.session.username = result.username;

    res.redirect('/');
  }).catch(err=>{
    res.render('login', { LogInError : ' Incorrect Username/Password ! ' });
  })

});

app.get('/logout', (req,res)=>{
  delete req.session.apiKey;
  delete req.session.userId;
  delete req.session.username;

  res.redirect('/');
})

app.get('/500', (req,res)=>{
  // set locals, only providing error in development
  res.locals.message = 'Some Error Occurred! , please contact Admin.';
  let err = {
    status : '500'
  };
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(500);
  res.render('error');
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
