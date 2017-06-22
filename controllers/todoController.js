const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const ToDo = mongoose.model('ToDo');
const Update = mongoose.model('Update');

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

	const team = await Team.findById(req.user.team).populate('members');
	const opponent = await Team.findById(req.query.opponent);

	console.log(req.query)
	if(team.members.length) {
		const update = new Update({
			message: `Spiritpoints for game against ${opponent.shortName} were submitted by ${req.user.name}`,
			users: team.members.map(obj => obj._id),
			link: `/my-team`,
			updateType: 'to-do'
		}).save(() => {});
	}
}