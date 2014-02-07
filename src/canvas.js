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

	var defaultOptions = {
		contextType: '2d',
		parent: document.body,
		width: 'auto',
		height: 'auto',
		resize: false,
		ratio: window.devicePixelRatio || 1
	};

	this.options = {};
	for (var option in defaultOptions) {
		if (defaultOptions.hasOwnProperty(option)) {
			this.options[option] = userOptions[option] || defaultOptions[option];
		}
	}

	var canvas = this.options.parent.appendChild(document.createElement('canvas'));
	var context = canvas.getContext(this.options.context);

	this.resize(null, this.options.width, this.options.height);

	if (this.options.resize) {
		window.addEventListener('resize', this.resize, false);
	}

	return {

		/**
		 * Get Context
		 * @return {Object} Canvas context.
		 */
		getContext : function () {
			return context || canvas.getContext(this.options.contextType);
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
			this.width = context.canvas.width = width;
			this.height = context.canvas.height = height;

			// Set the actual canvas width and height.
			canvas.style.width = width / this.options.ratio;
			canvas.style.height = height / this.options.ratio;

			return this;

		},


		/**
		 * Clears the canvas.
		 * @return {Object} This.
		 */
		clear : function () {
			context.clearRect(0, 0, this.width, this.height);
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
			if (canvas) {
				this.options.parent.removeChild(canvas);
			}

			// Reset variables.
			this.options = defaultOptions;
			canvas = null;
			context = null;

			return this;

		}
	};

};

module.exports = Canvas;

/*
// Look for AMD
if (typeof this.define === 'function' && this.define.amd) {

	this.define('Canvas', [], function () {
		return fil.Canvas;
	});

}
*/