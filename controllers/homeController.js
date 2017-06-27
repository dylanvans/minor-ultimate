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

    const swissStandingOptions = {
        uri: 'http://api.playwithlv.com/v1/swiss_rounds/',
        qs: {
            tournament_id: tournamentId,
            access_token: universalAccessToken
        },
        json: true
    };

	let swissStanding = await rp(swissStandingOptions)
        .then(data => {
        	return data.objects[0].standings;
        })
        .catch(err => {
            console.log(`Oops API call failed: ${err}`)
        });

	let userUpdates = [];
	const generalUpdates = await Update.find({ updateType: 'tournament-update' });

	if(req.user) {
		userUpdates = await Update.find({users: req.user._id})
	}

	let updates = generalUpdates.concat(userUpdates);
	updates = updates.sort((a,b) => {
		return new Date(b.createdAt) - new Date(a.createdAt);
	});

	res.render('index', {
		title: 'Home',
		liveGames,
		updates,
		swissStanding
	})
}

exports.infoPage = (req, res) => {
	res.render('info', {
		title: 'Info'
	})
}

exports.crew = (req, res) => {
	res.render('crew', {
		title: 'Crew'
	})
}

exports.tournamentUpdate = (req, res) => {
	const update = new Update({
		message: req.body.tournamentUpdate,
		link: `/info`,
		updateType: 'tournament-update'
	}).save(() => {
		req.flash('success', 'Your tournament update is posted');
		res.redirect('/');
	});
}