const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise;
const slug = require('slugs');

const liveGameSchema = new mongoose.Schema({
	gameId: String,
	team1: {
		type: mongoose.Schema.ObjectId,
		ref: 'Team'
	},
	team2: {
		type: mongoose.Schema.ObjectId,
		ref: 'Team'
	},
	team1Score: Number,
	team2Score: Number,
	slug: String,
	startDate: String,
	startTime: String,
	swissRoundId: String,
	field: String
});

liveGameSchema.pre('save', function(next) {
	if(!this.isModified('gameId')) { // If name is not modified skip slug generator
		next();
		return;
	}
	this.slug = slug(this.gameId);
	next();
})

module.exports = mongoose.model('LiveGame', liveGameSchema)