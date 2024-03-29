var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var inviteRouter = require('./routes/invite');
var postsRouter = require('./routes/posts');
var ssoRouter = require('./routes/sso-connections');
var membersRouter = require('./routes/members');
var organizationsRouter = require('./routes/organizations');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/invite', inviteRouter);
app.use('/api/posts', postsRouter);
app.use('/api/sso-connections', ssoRouter);
app.use('/api/members', membersRouter);
app.use('/api/organizations', organizationsRouter);
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
  res.render('error');
});

module.exports = app;
