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

// Links users to teams
// teamSchema.virtual('members', {
// 	ref: 'User', // Which model to link
// 	localField: 'name', // which field linked in Team
// 	foreignField: 'team' // which field linked in User
// });

teamSchema.pre('save', function(next) {
	if(!this.isModified('name')) { // If name is not modified skip slug generator
		next();
		return;
	}
	this.slug = slug(this.name);
	next();
})

module.exports = mongoose.model('Team', teamSchema)