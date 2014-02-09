(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){'use strict';

var canvas = require('./src/canvas');

global.FIT = module.exports = {
	Canvas: canvas
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/canvas":2}],2:[function(require,module,exports){
/*
 * canvas.js – Part of FIT (Front-end Interactive Toolkit)
 * Copyright (c) 2014, Danny Garcia. All rights reserved.
 * Code licensed under the MIT License
 * https://github.com/dannygarcia/fit/
 */

'use strict';

/**
 * Canvas Constructor
 * @param {Object} userOptions {
 *   {String} contextType '2d' or '3d'
 *   {Object} parent DOM Node
 *   {String||Number} width A 'auto' or number value of initial width.
 *   {String||Number} height A 'auto' or number value of initial height.
 *   {Boolean} resize Should it resize when the window resizes?
 *   {Number} ratio Device pixel ratio.
 * }
 * @return {Function} Canvas instance.
 */
var Canvas = function (userOptions) {

	this._defaultOptions = {
		contextType: '2d',
		parent: document.body,
		width: 'auto',
		height: 'auto',
		resize: false,
		ratio: window.devicePixelRatio || 1
	};

	this.options = {};
	userOptions = userOptions || {};

	for (var option in this._defaultOptions) {
		if (this._defaultOptions.hasOwnProperty(option)) {
			this.options[option] = userOptions[option] || this._defaultOptions[option];
		}
	}

	this._canvas = this.options.parent.appendChild(document.createElement('canvas'));
	this._context = this.getContext(this.options.contextType);

	this.resize(this.options.width, this.options.height);

	if (this.options.resize) {
		window.addEventListener('resize', this.resize.bind(this), false);
	}

	return this;

};

Canvas.prototype = {

	/**
	 * Get Context
	 * @return {Object} Canvas context.
	 */
	getContext : function () {
		return this._context || this._canvas.getContext(this.options.contextType);
	},

	/**
	 * Resize canvas element.
	 * @param  {Object} e (optional) HTML event.
	 * @param  {Number} width Desired width.
	 * @param  {Number} height Desired height.
	 * @return {Object} This.
	 */
	resize : function (e, width, height) {

		// Makes e optional.
		if (!e) {
			height = width;
			width = e;
		}

		// Determine the appropriate width.
		if (typeof width === 'undefined' || width === 'auto') {
			width = this.options.parent.offsetWidth;
		}

		// Determine the appropriate height.
		if (typeof height === 'undefined' || height === 'auto') {
			height = this.options.parent.offsetHeight;
		}

		width *= this.options.ratio;
		height *= this.options.ratio;

		// Set the appropriate canvas resolution.
		this.width = this._canvas.width = width;
		this.height = this._canvas.height = height;


		// Set the actual canvas width and height.
		this._canvas.style.width = width / this.options.ratio;
		this._canvas.style.height = height / this.options.ratio;

		return this;

	},


	/**
	 * Clears the canvas.
	 * @return {Object} This.
	 */
	clear : function () {
		this._context.clearRect(0, 0, this.width, this.height);
		return this;
	},

	/**
	 * Resets options, removes canvas element, resize events and context. Works as a cleanup after something like a transition out.
	 * @return {Object} This.
	 */
	destroy : function () {

		// Unbind resize.
		if (this.options.resize) {
			window.removeEventListener('resize', this.resize.bind(this), false);
		}

		// Remove canvas node.
		if (this._canvas) {
			this.options.parent.removeChild(this._canvas);
		}

		// Reset variables.
		this.options = this._defaultOptions;
		this._canvas = null;
		this._context = null;

		return this;

	}
};

module.exports = Canvas;

},{}]},{},[1,2])