const axios = require('axios');

(() => {
	const app = {
		init: function () {
			keepScore.init();
			collapsible.init();
			stars.init();
		}
	}

	const keepScore = {
		init: function () {
			this.numberInput();
			this.hideClass = 'js-hide';
	
		},
		numberInput: function () {
			const containerInput = document.querySelectorAll('.container-number-input');
			containerInput.forEach((el) => {
				const arrowUpEl = el.querySelector('.number-arrow-up');
				const arrowDownEl = el.querySelector('.number-arrow-down');
				const inputEl = el.querySelector('input[type="number"]');

				arrowUpEl.addEventListener('click', function() {
					inputEl.value = parseInt(inputEl.value) + 1;
				});

				arrowDownEl.addEventListener('click', function() {
					inputEl.value = parseInt(inputEl.value) - 1;
				});
			})
		}
	}

	const collapsible = {
		init: function () {
			const collapsibleContainer = document.querySelectorAll('.collapsible-content');

			collapsibleContainer.forEach((el) => {
				const collapseControl = el.querySelector('.collapse-control');
				collapseControl.addEventListener('click', function() {
					if (this.parentNode.classList.contains('collapsible-active')) {
						this.parentNode.classList.remove('collapsible-active');
					} else {
						this.parentNode.classList.add('collapsible-active');
					}
				});
			});
		}
	}

	const stars = {
		init: function () {
			const starForms = document.querySelectorAll('.star-form');
			starForms.forEach(el => {
				el.addEventListener('submit', this.sendStar)
			});
		},
		sendStar: function (e) {
			e.preventDefault();
			axios
				.post(this.action)
				.then(res => {
					const starClasslist = this.star.classList;
					starClasslist.contains('star-active') ? starClasslist.remove('star-active') : starClasslist.add('star-active');
				})
				.catch(console.error)
		}
	}

	app.init();
})()