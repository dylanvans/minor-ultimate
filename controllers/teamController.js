const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const ToDo = mongoose.model('ToDo');
const moment = require('moment');
const rp = require('request-promise');
require('dotenv').config();

const universalAccessToken = process.env.UNIVERSALACCESSTOKEN;
const seasonId = process.env.SEASONID;
const tournamentId = process.env.TOURNAMENTID;

const momentFormat = 'YYYY-MM-DDTHH:mm:ss+Z';

exports.myTeam = async (req, res) => {
	const currentTime = moment().format(momentFormat);
	const team = await Team.findById(req.user.team);
	team.toDo = await ToDo.find({team: team._id});

	let games;

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
			games = data.objects;
		})
	    .catch(err => {
			console.log(`Oops API call failed: ${err}`)
	    });

	    team.upcomingGames = [];
	    team.liveGames = [];
	    team.finishedGames = [];

	    games.forEach(game => {
	    	const startTime = moment(game.start_time, momentFormat);
			const endTime = moment(startTime, momentFormat).add(90, 'm'); // TO DO 90 minutes still hardcoded
 
 			// To DO get live game from DB instead of calculation
			if (moment(currentTime, momentFormat).isBefore(moment(startTime, momentFormat))) {
				team.upcomingGames.push(game)
			} else if (moment(currentTime, momentFormat).isBetween(moment(startTime), moment(endTime))) {
				team.liveGames.push(game)
			} else {
				team.finishedGames.push(game)
			}
	    });

	res.render('myTeam', {
		title: 'My Team',
		team
	});
}