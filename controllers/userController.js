const mongoose = require('mongoose');
const User = mongoose.model('User');
const Team = mongoose.model('Team');
const promisify = require('es6-promisify');

exports.loginPage = (req, res) => {
	res.render('login', {
		title: 'Login',
		authUrl: '/'
	});
}

exports.registerForm = async (req, res) => {
	const teams = await Team.find();
	res.render('register', {
		title: 'Register',
		teams
	});
}

exports.validateRegister = (req, res, next) => {
	req.sanitizeBody('name');
	req.checkBody('name', 'Fill in a name!').notEmpty();
	req.checkBody('password', 'Fill in a password!').notEmpty();
	req.checkBody('password-confirm', 'Confirm your password!').notEmpty();
	req.checkBody('password-confirm', 'Your passwords do not match').equals(req.body.password);

	const errors = req.validationErrors(); // Method that checks all validation errors above
	if (errors) {
		req.flash('error', errors);
		// TODO::
		// flashes when validate errors occur
		res.redirect('/register')
		return;
	}
	next();
}

exports.register = async (req, res, next) => {
	const user = new User({ name: req.body.name, team: req.body.team });
	const register = promisify(User.register, User); // Object User 2nd parameter promisify to bind it to the object
	await register(user, req.body.password);

	next();
}