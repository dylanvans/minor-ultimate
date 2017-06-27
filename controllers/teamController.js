const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const User = mongoose.model('User');
const ToDo = mongoose.model('ToDo');
const moment = require('moment');
const rp = require('request-promise');
require('dotenv').config();

const universalAccessToken = process.env.UNIVERSALACCESSTOKEN;
const seasonId = process.env.SEASONID;
const tournamentId = process.env.TOURNAMENTID;

const momentFormat = 'YYYY-MM-DDTHH:mm:ss+Z';

exports.teamPage = async (req, res) => {
	const currentTime = moment().format(momentFormat);
	const team = await Team.findOne({slug: req.params.name}).populate('members');

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
	    	const startDate = moment(game.start_time, momentFormat);
			const endDate = moment(startDate, momentFormat).add(90, 'm'); // TO DO 90 minutes still hardcoded
			const startHour = moment(game.start_time, momentFormat).get('hour');
			let startMinute = moment(game.start_time, momentFormat).get('minute');
			startMinute = startMinute < 10 ? `0${startMinute}`: startMinute;
			game.startTime = `${startHour}:${startMinute}`;

 
 			// To DO get live game from DB instead of calculation
			if (moment(currentTime, momentFormat).isBefore(moment(startDate, momentFormat))) {
				team.upcomingGames.push(game)
			} else if (moment(currentTime, momentFormat).isBetween(moment(startDate), moment(endDate))) {
				team.liveGames.push(game)
			} else {
				team.finishedGames.push(game)
			}
	    });

	res.render('team', {
		title: team.name,
		team
	});
}

exports.myTeam = async (req, res) => {
	const currentTime = moment().format(momentFormat);
	const team = await Team.findById(req.user.team).populate('todo');
	team.todo = team.todo.filter(obj => {
		return obj.status == 'todo';
	});
	
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
	    	const startDate = moment(game.start_time, momentFormat);
			const endDate = moment(startDate, momentFormat).add(90, 'm'); // TO DO 90 minutes still hardcoded
			const startHour = moment(game.start_time, momentFormat).get('hour');
			let startMinute = moment(game.start_time, momentFormat).get('minute');
			startMinute = startMinute < 10 ? `0${startMinute}`: startMinute;
			game.startTime = `${startHour}:${startMinute}`;

 
 			// To DO get live game from DB instead of calculation
			if (moment(currentTime, momentFormat).isBefore(moment(startDate, momentFormat))) {
				team.upcomingGames.push(game)
			} else if (moment(currentTime, momentFormat).isBetween(moment(startDate), moment(endDate))) {
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

exports.starTeam = async (req, res) => {
	const stars = req.user.stars.map( obj => obj.toString());

	// Pull takes the object out of the collection
	// addToSet adds a value unless the value is already present
	const operator = stars.includes(req.params.id) ? '$pull' : '$addToSet';
	const user = await User.findOneAndUpdate(
		{ _id: req.user._id}, // query
		{ [operator]: { stars: req.params.id}},
		{ new: true }
	);

	res.json(user);
}

exports.starPage = async (req, res) => {
	const teams = await Team.find({
		_id: { $in: req.user.stars }
	});
	
	res.render('starred', {
		title: 'Starred',
		teams
	});
}




