const mongoose = require('mongoose');
const moment = require('moment');
const rp = require('request-promise');
const LiveGame = mongoose.model('LiveGame');
const Update = mongoose.model('Update');
const Team = mongoose.model('Team');
require('dotenv').config();

const universalAccessToken = process.env.UNIVERSALACCESSTOKEN;
const seasonId = process.env.SEASONID;
const tournamentId = process.env.TOURNAMENTID;

exports.homePage = async (req, res) => {
	const liveGames = await LiveGame.find().populate('team1 team2');
	let updates = [];
	if(req.user) {
		updates = await Update.find({users: req.user._id})
	}


	res.render('index', {
		title: 'Home',
		liveGames,
		updates
	})
}

exports.infoPage = (req, res) => {
	res.render('info', {
		title: 'Info',
	})
}