const rp = require('request-promise');
require('dotenv').config();

const universalAccessToken = process.env.UNIVERSALACCESSTOKEN;

exports.gamePage = async (req, res) => {
	const getGameOptions = {
	    uri: `http://api.playwithlv.com/v1/games/${req.params.id}/`,
	    qs: {
	        access_token: universalAccessToken
	    },
	    json: true
	};

	const game = await rp(getGameOptions)
		.then(data => {
			console.log(data)
			return data;
		})
	    .catch(err => {
			console.log(`Oops API call failed: ${err}`)
	    });
		
	res.render('game', {
		title: 'Game',
		game
	});
}
