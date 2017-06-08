var io = require('socket.io');
var request = require('request');

exports.socketServer = function(app, http) {
	io = io(http);

	io.on('connection', function(socket) {
		socket.on('room', function(room) {
			console.log('ja hallo')
			socket.join(room)
		});
	});
}