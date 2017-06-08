const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginPage = (req, res) => {
	req.flash('info', 'login pagina')
	res.render('login', {
		title: 'Login',
		authUrl: '/'
	});
}

exports.registerForm = (req, res) => {
	res.render('register', {
		title: 'Register'
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
		console.log(errors)
		res.render('register', {
			title: 'Register',
			body: req.body
		});
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