const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const ToDo = mongoose.model('ToDo');

exports.spiritPoints = async (req, res) => {
	const toDo = await ToDo.findById(req.params.id);
	const opponent = await Team.findById(toDo.opponent);

	res.render('todo', {
		title: 'Spirit points',
		toDo,
		opponent
	});
}

exports.submitPoints = async (req, res) => {
	ToDo.findOneAndUpdate({_id: req.params.id, team: req.user.team, todoType: 'spirit'}, {status: 'done'}, () => {
		res.redirect('/my-team');
	});
}