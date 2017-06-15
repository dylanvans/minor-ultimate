const rp = require('request-promise');
const leaguevineHandler = require('../handlers/leaguevine');
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

exports.updateScore = async (req, res) => {
	const updateScoreOptions = {
		method: 'POST',
	    uri: `http://api.playwithlv.com/v1/game_scores/`,
	    headers: {
			Authorization: `bearer ${universalAccessToken}`
	    },
	    body: {
	    	game_id: req.params.id,
			team_1_score: req.body.team1Score,
			team_2_score: req.body.team2Score,
			is_final: false
	    },
	    json: true
	};

	const game = await rp(updateScoreOptions)
		.then(data => {
			console.log(data)
			leaguevineHandler.setLiveGames()
			return data;
		})
	    .catch(err => {
			console.log(`Oops API call failed: ${err}`)
	    });

	res.redirect(req.get('referer'));
}
