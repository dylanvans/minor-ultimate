const request = require('request');

exports.homePage = (req, res) => {
	// req.session.accessToken = '8d630cf0cd'; // dev
	// if(!req.session.accessToken) {
	// 	res.redirect('/login');
	// } else {
	// 	console.log(req.session.accessToken)
	// 	request(`http://api.playwithlv.com/v1/games/?tournament_id=20058&limit=10&starts_before=2016-06-03T11%3A20%3A00%2B02%3A00&access_token=${req.session.accessToken}`, function(err, response, body) {
	// 		const data = JSON.parse(body);
	// 		console.log(data.objects[0])
	// 		res.render('index', {
	// 			title: 'Home',
	// 			games: data.objects
	// 		})
	// 	});	
	// }

	res.render('index', {
		title: 'Home',
		games: []
	})
}

exports.infoPage = (req, res) => {
	res.render('info', {
		title: 'Info',
	})
}