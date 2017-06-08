const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const rp = require('request-promise');
require('dotenv').config();

const universalAccessToken = process.env.UNIVERSALACCESSTOKEN;
const seasonId = process.env.SEASONID;
const tournamentId = process.env.TOURNAMENTID;

exports.myTeam = async (req, res) => {
	const team = await Team.findById(req.user.team);

	const teamsFromTournamentOptions = {
	    uri: 'http://api.playwithlv.com/v1/games/',
	    qs: {
	        tournament_id: tournamentId,
	        team_ids: `[${team.leaguevineId}]`,
	        season_id: seasonId,
	        access_token: universalAccessToken
	    },
	    json: true
	};

	await rp(teamsFromTournamentOptions)
		.then(data => {
			team.games = data.objects;
		})
	    .catch(err => {
			console.log(`Oops API call failed: ${err}`)
	    });

	console.log(team.games)
	res.render('myTeam', {
		title: 'My Team',
		team
	});
}