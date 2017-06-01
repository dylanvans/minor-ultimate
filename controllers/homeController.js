var request = require('request');

exports.homePage = function(req, res) {
	if(!req.session.accessToken) {
		res.redirect('/login');
	} else {
		console.log(req.session.accessToken)
		request(`http://api.playwithlv.com/v1/tournament_teams/?tournament_ids=%5B20059%5D&access_token=${req.session.accessToken}`, function(err, response, body) {
			console.log(JSON.parse(body));
		});
		res.render('index');
	}
}
