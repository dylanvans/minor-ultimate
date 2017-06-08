const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise; // Only to prevent weird console message
// const validator = require('validator')// String validators and sanitizers
const mongodbErrorHandler = require('mongoose-mongodb-errors'); // Transforms mongo errors to readable messages
const passwordLocalMongoose = require('passport-local-mongoose'); // http://mherman.org/blog/2013/11/11/user-authentication-with-passport-dot-js/

const userSchema = new Schema({
	name: {
		type: String,
		required: 'Fill in a name', // Acts as true -> error meassage
		trim: true,
		unique: true
	},
	userType: {
		type: String,
		trim: true
	},
	team: {
		type: mongoose.Schema.ObjectId,
		ref: 'Team'
	}
});

userSchema.plugin(passwordLocalMongoose, { usernameField: 'name' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);