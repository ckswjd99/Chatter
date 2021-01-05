var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSession = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatRoomRouter = require('./routes/chatRoom');
const session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const sessionMiddleware = expressSession({
  secret: '#@!MYSECRET!@#',
  resave: true,
  saveUninitialized: true
});

app.use(sessionMiddleware);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chatRoom', chatRoomRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { errorMsg: err });
});

module.exports = {
  app: app,
  sessionMiddleware: sessionMiddleware
};