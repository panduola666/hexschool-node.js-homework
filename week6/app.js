var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const notFound = require('./middleware/notFound')
const totalCatch = require('./middleware/totalCatch')

var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

var app = express();
require('./connections');

process.on('uncaughtException',err =>{
    console.error(err.name);
    console.error(err.message);
    console.error(err.stack);
    process.exit(1)
})

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use(notFound)
app.use(totalCatch)

process.on('unhandledRejection',(err,promise) => {
    console.error(`未捕捉到的 rejection： ${promise}, 原因: ${err}`);
})

module.exports = app;
