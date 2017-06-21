const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise;
const slug = require('slugs');

const teamSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: 'Please enter a teamname'
	},
	shortName: {
		type: String,
		trim: true
	},
	leaguevineId: {
		type: String,
		trim: true
	},
	slug: String,
	description: {
		type: String,
		trim: true
	},
	city: {
		type: String,
		trim: true
	},
	country: {
		type: String,
		trim: true
	}
});

teamSchema.index({
	leaguevineId: 1
});

teamSchema.virtual('members', {
	ref: 'User',
	localField: '_id', // field on the team
	foreignField: 'team' // field on the user
});

teamSchema.virtual('starredUsers', {
	ref: 'User',
	localField: '_id', // field on the team
	foreignField: 'stars' // field on the user
});

teamSchema.virtual('todo', {
	ref: 'ToDo',
	localField: '_id', // field on the team
	foreignField: 'team' // field on the todo
});

teamSchema.pre('save', function(next) {
	if(!this.isModified('name')) { // If name is not modified skip slug generator
		next();
		return;
	}
	this.slug = slug(this.name);
	next();
})

module.exports = mongoose.model('Team', teamSchema)