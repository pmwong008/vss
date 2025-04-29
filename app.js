var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('cors');
// const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
var cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
// var logger = require('morgan');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
// const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
require('dotenv').config();
// const PORT = process.env.PORT || 3000;

var indexRouter = require('./routes/root');

// var usersRouter = require('./routes/api/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));

// custom middleware logger
app.use(logger);
// Cross Origin Resource Sharing
app.use(cors());
/* app.use(cors({
  origin: 'http://localhost:3000', // Your front-end domain
  credentials: true,             // Allow cookies
})); */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.get('/favicon.ico', (req, res) => {
  // res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  res.status(204).end(); // Sends a 204 No Content response
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', require('./routes/auth'));

app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// app.use(verifyJWT);
app.use('/adminDashboard', require('./routes/adminDashboard'));
app.use('/register', require('./routes/register'));
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));
app.use('/pigeons', require('./routes/api/pigeons'));
app.use('/calendar', require('./routes/api/calendar'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

// Connect to MongoDB
connectDB();

/* mongoose.connection.once('open', () => {
  console.log('Mongoose connection established');
  // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});  */
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}


module.exports = app;
