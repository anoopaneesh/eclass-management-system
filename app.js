var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var db = require('./config/config')
var mailer = require('./config/mail-config')
var hbs = require('express-handlebars')
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/users');
var studentRouter = require('./routes/student');
var teacherRouter = require('./routes/teacher')
var fileUpload = require('express-fileupload')
var app = express();

// view engine setup
app.use(session({secret:"Key",cookie:{maxAge:600000}}))
app.use(fileUpload())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/',helpers:require('./helpers/hbsHelpers')}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


db.connection((err)=>{
  if(err){
    console.log('Database Connection Error ',err)
  }else{
    console.log('Database connected to port 27017')
  }
})
mailer.config()

app.use('/', userRouter);
app.use('/student',studentRouter)
app.use('/teacher',teacherRouter)
app.use('/admin', adminRouter);

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
