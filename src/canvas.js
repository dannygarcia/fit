/*
 * canvas.js – Part of FIT (Front-end Interactive Toolkit)
 * Copyright (c) 2014, Danny Garcia. All rights reserved.
 * Code licensed under the MIT License
 * https://github.com/dannygarcia/fit/
 */


'use strict';

/*
*
* Options
*
* context	[str]		-	Context type.
* parent	[dom]		-	<canvas> parent.
* width		[num/str]	-	Canvas width. 'auto' fits to parent.
* height	[num/str]	-	Canvas height. 'auto' fits to parent.
* resize	[bool]		-	Should the canvas width/height be reset
*							when the window is resized?
*/

/**
 * Canvas Constructor
 * @param {Object} userOptions
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
	this._context = this._canvas.getContext(this.options.context);

	this.resize(null, this.options.width, this.options.height);

	if (this.options.resize) {
		window.addEventListener('resize', this.resize, false);
	}

	return this;

};

Canvas.prototype = {

	/**
	 * Get Context
	 * @return {Object} Canvas context.
	 */
	getContext : function () {
		return this._context || this._canvas.getthis._Context(this.options.contextType);
	},

	/**
	 * Resize canvas element.
	 * @param  {Object} e HTML event.
	 * @param  {Number} width Desired width.
	 * @param  {Number} height Desired height.
	 * @return {Object} This.
	 */
	resize : function (e, width, height) {

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
			window.removeEventListener('resize', this.options.resize, false);
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
