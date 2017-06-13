const request = require('request');
const moment = require('moment');
const rp = require('request-promise');
require('dotenv').config();

const universalAccessToken = process.env.UNIVERSALACCESSTOKEN;
const seasonId = process.env.SEASONID;
const tournamentId = process.env.TOURNAMENTID;

const momentFormat = 'YYYY-MM-DDTHH:mm:ss+02:00'; // TO DO timezone  still hardcoded

exports.homePage = async (req, res) => {
	const currentTime = moment().format(momentFormat);

	const getGamesOptions = {
	    uri: 'http://api.playwithlv.com/v1/games/',
	    qs: {
	        tournament_id: tournamentId,
	        season_id: seasonId,
	        starts_before: currentTime,
	        access_token: universalAccessToken
	    },
	    json: true
	};

	let games = [];

	await rp(getGamesOptions)
		.then(data => {
			games = data.objects;
			games = games.filter(game => {
				const startTime = moment(game.start_time, momentFormat);
				const endTime = moment(startTime).add(90, 'm'); // TO DO 90 minutes still hardcoded
				if(moment(currentTime).isBetween(startTime, endTime)) {
					return game;
				}
			});
		})
	    .catch(err => {
			console.log(`Oops API call failed: ${err}`)
	    });

	res.render('index', {
		title: 'Home',
		games
	})
}

exports.infoPage = (req, res) => {
	res.render('info', {
		title: 'Info',
	})
}