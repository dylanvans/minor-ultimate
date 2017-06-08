const request = require('request');

exports.gamePage = (req, res) => {
	request(`http://api.playwithlv.com/v1/games/199777/?access_token=${req.session.accessToken}`, function(err, response, body) {
		const data = JSON.parse(body);
		console.log(data);
		
		res.render('game', {
			title: 'Game',
			data: data
		});
	});
}
