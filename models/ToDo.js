const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise;

const toDoSchema = new mongoose.Schema({
	team: {
		type: mongoose.Schema.ObjectId,
		ref: 'Team'
	},
	opponent: {
		type: mongoose.Schema.ObjectId,
		ref: 'Team'
	},
	game: String,
	text: String,
	todoType: String,
	status: String
});

module.exports = mongoose.model('ToDo', toDoSchema)