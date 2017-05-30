// Require
var path = require('path');
var http = require('http');
var request = require('request');
var dotenv = require('dotenv');
var express = require('express');
var session = require('express-session');
var compression = require('compression');
var bodyParser = require('body-parser');

// Config
var app = express();
dotenv.config();
http = http.createServer(app);
app.use(compression());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.leaguevineRedirectURI = process.env.LEAGUEVINE_REDIRECT_URI;
app.leaguevineClientId = process.env.LEAGUEVINE_CLIENT_ID;
app.leaguevineClientSecretKey = process.env.LEAGUEVINE_CLIENT_SECRET_KEY;

app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  key: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false
}))

var urlGetAuthCode = `http://www.playwithlv.com/oauth2/authorize/?client_id=${app.leaguevineClientId}&response_type=code&redirect_uri=${app.leaguevineRedirectURI}&scope=universal`;
var urlGetAccessToken = `http://www.playwithlv.com/oauth2/token/?client_id=${app.leaguevineClientId}&client_secret=${app.leaguevineClientSecretKey}&grant_type=authorization_code&redirect_uri=${app.leaguevineRedirectURI}`;

app.get('/', function(req, res) {
	console.log(req.session.accessToken)
	res.render('index');
});

app.get('/login', function(req, res) {
	res.redirect(urlGetAuthCode);
});

app.get('/success', function(req, res) {
	var code = req.query.code;

	request(urlGetAccessToken + `&code=${req.query.code}`, function(err, response, body) {
		var data = JSON.parse(body);
		req.session.accessToken = data.access_token;

		// request(`http://api.playwithlv.com/v1/games/234/?access_token=${req.session.accessToken}`, function(err, response, body) {
		// 	console.log(body);
		// });

		res.redirect('/');
	});
});

http.listen(process.env.PORT || 3001, function() {
	console.log('Listening on port 3001');
});
