const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise;

const updateSchema = new mongoose.Schema({
	users: [
		{ type: mongoose.Schema.ObjectId, ref: 'User' }
	],
	teams: [
		{ type: mongoose.Schema.ObjectId, ref: 'Team' }
	],
	game: {
		type: mongoose.Schema.ObjectId, ref: 'Game'
	},
	message: {
		type: String,
		required: 'Please, fill in a message', // Acts as true -> error meassage
		trim: true
	},
	link: String,
	updateType: String
});

module.exports = mongoose.model('Update', updateSchema)