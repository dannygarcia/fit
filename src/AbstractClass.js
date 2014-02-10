'use strict';

var AbstractModule = function (Class) {
	Class = Class || function () {};
	Class.prototype = Object.create(AbstractModule.prototype);
	Class.prototype.constructor = Class;
	return Class;
};

AbstractModule.prototype._setOptions = function (defaultOptions, userOptions) {

	this._defaultOptions = defaultOptions || {};

	this.options = {};
	userOptions = userOptions || {};

	for (var option in this._defaultOptions) {
		if (this._defaultOptions.hasOwnProperty(option)) {
			this.options[option] = userOptions[option] || this._defaultOptions[option];
		}
	}

	return this;

};

module.exports = AbstractModule;
