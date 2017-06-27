const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const LiveGame = mongoose.model('LiveGame');
const ToDo = mongoose.model('ToDo');
const Update = mongoose.model('Update');
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

	
	const team1 = await Team.findOne({leaguevineId: game.team_1_id});
	const team2 = await Team.findOne({leaguevineId: game.team_2_id});
	game.team1Slug = team1.slug;
	game.team2Slug = team2.slug;
		
	res.render('game', {
		title: 'Game',
		game
	});
}

exports.updateScore = async (req, res) => {
	const game = await LiveGame.findOne({gameId: req.params.id});

	if (game) {
		console.log(game)
		const team1 = await Team.findById(game.team1).populate('members starredUsers');
		const team2 = await Team.findById(game.team2).populate('members starredUsers');

		let members = team1.members.concat(team2.members); 
		let starredUsers = team1.starredUsers.concat(team2.starredUsers); 
		let users = members.concat(starredUsers); 

		// Filter duplicates out of the array source: https://stackoverflow.com/a/36744732/8038487
		users = users.filter((thing, index, self) => self.findIndex((t) => {return t.place === thing.place && t.name === thing.name; }) === index).map(obj => {
			return obj._id
		});


		const update = new Update({
			message: `Score was updated to ${req.body.team1Score}-${req.body.team2Score} in game: ${team1.shortName} vs ${team2.shortName}`,
			teams: [team1._id, team2._id],
			users,
			link: `/game/${req.params.id}`,
			updateType: 'score-update'
		}).save(() => {});
	}

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
			is_final: (req.body.final == 'on')
	    },
	    json: true
	};

	const request = await rp(updateScoreOptions)
		.then(data => {
			leaguevineHandler.setLiveGames()
			return data;
		})
	    .catch(err => {
			console.log(`Oops API call failed: ${err}`)
	    });

	if(req.body.final == 'on') {
		ToDo.update({game: req.params.id, todoType: 'score'}, {$set: {status: 'done'}}, {multi: true}, () => {});
	}

	req.flash('success', 'The score of the game was successfully updated');
	res.redirect(req.get('referer'));
}

