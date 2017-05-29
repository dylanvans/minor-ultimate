// Require
var path = require('path');
var http = require('http');
var request = require('request');
var dotenv = require('dotenv');
var express = require('express');

// Config
var app = express();
dotenv.config();
http = http.createServer(app);

app.redirectURI = process.env.LEAGUEVINE_REDIRECT_URI;
app.clientId = process.env.LEAGUEVINE_CLIENT_ID;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/login', function(req, res) {
	res.redirect('https://www.google.com');
});

http.listen(process.env.PORT || 3001, function() {
	console.log('Listening on port 3001');
});
