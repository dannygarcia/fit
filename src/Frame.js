/*
 * Frame.js – Part of FIT (Front-end Interactive Toolkit)
 * Copyright (c) 2014, Danny Garcia. All rights reserved.
 * Code licensed under the MIT License
 * https://github.com/dannygarcia/fit/
 */

'use strict';

var AbstractClass = require('./AbstractClass');

/**
 * Frame Constructor
 * @param {Object} userOptions {
 * }
 * @return {Function} Frame instance.
 */
var Frame = new AbstractClass(function (userOptions) {

	this._setOptions({
		autoStart: false
	}, userOptions);

	this.active = this.options.autoStart;
	this.request = null;
	this.frame = 0;

	if (this.options.autoStart) {
		this.start();
	}

	return this;

});

/**
 * Frame Step Hook
 * @param  {Number} frame Frame count.
 */
Frame.prototype.step = function (/** frame **/) {};

/**
 * Start rAF loop.
 * @return {Object} This.
 */
Frame.prototype.start = function () {

	if (!this.active) {

		var self = this,
			animationLoop = function () {
				self.request = window.requestAnimationFrame(animationLoop);
				self.step(self.frame);
				self.frame++;
			};

		if (typeof window.requestAnimationFrame === 'undefined') {

			window.requestAnimationFrame = (function () {
				return  window.requestAnimationFrame       ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame    ||
						window.oRequestAnimationFrame      ||
						window.msRequestAnimationFrame     ||
						function (callback) {
							window.setTimeout(callback, 1000 / 60);
						};
			}());

		}

		if (typeof window.cancelAnimationFrame === 'undefined') {

			window.cancelAnimationFrame = (function () {
				return  window.cancelAnimationFrame       ||
						window.webkitCancelAnimationFrame ||
						window.mozCancelAnimationFrame    ||
						window.oCancelAnimationFrame      ||
						window.msCancelAnimationFrame;
			}());

		}

		animationLoop();
		this.active = true;

	}

	return this;

};

/**
 * Stop rAF loop.
 * @return {Object} This.
 */
Frame.prototype.stop = function () {

	if (this.active) {
		window.cancelAnimationFrame(this.request);
	}

	return this;

};

/**
 * Resets options and stops the rAF.
 * @return {Object} This.
 */
Frame.prototype.destroy = function () {

	this.stop();
	this.options = this._defaultOptions;
	return this;

};

module.exports = Frame;
