(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {
	var app = {
		init: function init() {
			keepScore.init();
			collapsible.init();
		}
	};

	var keepScore = {
		init: function init() {
			this.numberInput();
			this.hideClass = 'js-hide';
		},
		numberInput: function numberInput() {
			var containerInput = document.querySelectorAll('.container-number-input');
			containerInput.forEach(function (el) {
				var arrowUpEl = el.querySelector('.number-arrow-up');
				var arrowDownEl = el.querySelector('.number-arrow-down');
				var inputEl = el.querySelector('input[type="number"]');

				arrowUpEl.addEventListener('click', function () {
					inputEl.value = parseInt(inputEl.value) + 1;
				});

				arrowDownEl.addEventListener('click', function () {
					inputEl.value = parseInt(inputEl.value) - 1;
				});
			});
		}
	};

	var collapsible = {
		init: function init() {
			var collapsibleContainer = document.querySelectorAll('.collapsible-content');

			collapsibleContainer.forEach(function (el) {
				var collapseControl = el.querySelector('.collapse-control');
				collapseControl.addEventListener('click', function () {
					if (this.parentNode.classList.contains('collapsible-active')) {
						this.parentNode.classList.remove('collapsible-active');
					} else {
						this.parentNode.classList.add('collapsible-active');
					}
				});
			});
		}
	};

	app.init();
})();

},{}]},{},[1]);
