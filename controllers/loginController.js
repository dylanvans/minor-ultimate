var dotenv = require('dotenv');
var request = require('request');

dotenv.config();

var leaguevineRedirectURI = process.env.LEAGUEVINE_REDIRECT_URI;
var leaguevineClientId = process.env.LEAGUEVINE_CLIENT_ID;
var leaguevineClientSecretKey = process.env.LEAGUEVINE_CLIENT_SECRET_KEY;

var urlGetAuthCode = `http://www.playwithlv.com/oauth2/authorize/?client_id=${leaguevineClientId}&response_type=code&redirect_uri=${leaguevineRedirectURI}&scope=universal`;
var urlGetAccessToken = `http://www.playwithlv.com/oauth2/token/?client_id=${leaguevineClientId}&client_secret=${leaguevineClientSecretKey}&grant_type=authorization_code&redirect_uri=${leaguevineRedirectURI}`;

exports.loginPage = function(req, res) {
	res.render('login', {
		authUrl: urlGetAuthCode
	});
}

exports.onSuccess = function(req, res) {
	var code = req.query.code;

	request(urlGetAccessToken + `&code=${req.query.code}`, function(err, response, body) {
		var data = JSON.parse(body);
		req.session.accessToken = data.access_token;

		res.redirect('/');
	});
}
