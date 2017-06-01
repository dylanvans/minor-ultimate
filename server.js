// Require
var path = require('path');
var http = require('http');
var dotenv = require('dotenv');
var express = require('express');
var session = require('express-session');
var compression = require('compression');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

// Config
var app = express();
dotenv.config();
http = http.createServer(app);
app.use(compression());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  key: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false
}))

app.use('/', routes);

http.listen(process.env.PORT || 3001, function() {
	console.log('Listening on port 3001');
});
