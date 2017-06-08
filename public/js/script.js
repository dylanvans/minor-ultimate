(() => {
	var app = {
		init: () => {
			liveGames.init();
		}
	}

	var liveGames = {
		init: function() {
			this.hideClass = 'js-hide';
			this.btnToGameEl = document.querySelectorAll('.btn-to-game');
			this.gameView = document.querySelector('.view-detail-game');
			this.socket = io.connect();

			this.btnToGameEl.forEach(el => {
				el.addEventListener('click', () => {
					// this.fillGameView();
					this.showGame()

					var room = el.dataset.gameid;
					this.socket.emit('room', room)
				});
			});
		},
		showGame: function() {
			this.gameView.classList.remove(this.hideClass);
		}
	}

	app.init();
})()