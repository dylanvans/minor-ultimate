const mongoose = require('mongoose');
const moment = require('moment');
const rp = require('request-promise');
const LiveGame = mongoose.model('LiveGame');
const Team = mongoose.model('Team');
require('dotenv').config();

const universalAccessToken = process.env.UNIVERSALACCESSTOKEN;
const seasonId = process.env.SEASONID;
const tournamentId = process.env.TOURNAMENTID;

exports.homePage = async (req, res) => {
	const liveGames = await LiveGame.find();

	for (var i = 0; i < liveGames.length; i++) {
		liveGames[i].team1 = await Team.findById(liveGames[i].team1);
		liveGames[i].team2 = await Team.findById(liveGames[i].team2);
	}

	res.render('index', {
		title: 'Home',
		liveGames
	})
}

exports.infoPage = (req, res) => {
	res.render('info', {
		title: 'Info',
	})
}