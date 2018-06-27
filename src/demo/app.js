var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config/chunkConfig');
// var favicon = require('favicon');

var index = require('./routes/index');

var app = express();
+

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine( '.html', require( 'ejs' ).__express );

app.locals['filePath'] = config.mode === 'dev'?config.devConfig.filePath:config.prodConfig.filePath;
app.locals['vendorHash'] = config.hashChunks['vendor'] || '';
app.locals['resetHash'] = config.hashChunks['reset'] || '';

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

module.exports = app;
