var createError = require('http-errors');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// CORS Setting
var cors = require('cors');

// DB Setting
var { sequelize } = require('./models'); // db.sequelize

// Router Setting
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var devicesRouter = require('./routes/devices');
var pictureRouter = require('./routes/pictures');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// DB Connection
sequelize.sync({ force: true })
  .then(() => {
    console.log('DB Connected');
  }).catch((err) => {
    console.error(err);
  });

// Router Connection
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/devices', devicesRouter);
app.use('/pictures', pictureRouter);

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

// https://freestrokes.tistory.com/138