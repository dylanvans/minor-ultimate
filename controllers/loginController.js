const dotenv = require('dotenv');
const passport = require('passport')
const request = require('request');

dotenv.config();

const leaguevineRedirectURI = process.env.LEAGUEVINE_REDIRECT_URI;
const leaguevineClientId = process.env.LEAGUEVINE_CLIENT_ID;
const leaguevineClientSecretKey = process.env.LEAGUEVINE_CLIENT_SECRET_KEY;

const urlGetAuthCode = `http://www.playwithlv.com/oauth2/authorize/?client_id=${leaguevineClientId}&response_type=code&redirect_uri=${leaguevineRedirectURI}&scope=universal`;
const urlGetAccessToken = `http://www.playwithlv.com/oauth2/token/?client_id=${leaguevineClientId}&client_secret=${leaguevineClientSecretKey}&grant_type=authorization_code&redirect_uri=${leaguevineRedirectURI}`;

// exports.loginPage = (req, res) => {
// 	res.render('login', {
// 		title: 'Login',
// 		authUrl: urlGetAuthCode
// 	});
// }

exports.onSuccess = (req, res) => {
	const code = req.query.code;

	request(urlGetAccessToken + `&code=${req.query.code}`, function(err, response, body) {
		const data = JSON.parse(body);
		req.session.accessToken = data.access_token;

		res.redirect('/');
	});
}

exports.login = passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: 'Login Failed',
	successRedirect: '/',
	successFlash: 'Login Successfull'
});

exports.logout = (req, res) => {
	req.logout(); // Build in passport.js
	res.redirect('/');	
}