/*global
	FIT: true,
	module: true,
	test:true,
	ok: true
*/

'use strict';

(function () {
	var input;
	module('Input', {
		setup: function () {
			input = new FIT.Input({
				autoBindInputs: false
			});
		},
		teardown: function () {
			input.destroy();
		}
	});
	test('instantiation', function () {
		ok(typeof input === 'object', 'returns a type of object');
	});
	test('._makeCoordinate', function () {
		var c, x = 10, y = 20;

		input.options.type = 'object';
		c = input._makeCoordinate(x, y);
		ok(typeof c === 'object', 'returns a type of object for object type coordinates');
		ok(c.x === x, 'sets correct X coordinates');
		ok(c.y === y, 'sets correct Y coordinates');

		input.options.type = 'array';
		c = input._makeCoordinate(x, y);
		ok(c instanceof Array, 'returns a instance of array for array instance coordinates');
		ok(c[0] === x, 'sets correct X coordinates');
		ok(c[1] === y, 'sets correct Y coordinates');
	});
	test('._getX, ._getY', function () {
		var x = 10, y = 20,
			getX, getY;

		input.options.type = 'array';

		getX = input._getX([x, y]);
		ok(getX === x, '.getX array');

		getY = input._getY([x, y]);
		ok(getY === y, '.getY array');

		input.options.type = 'object';

		getX = input._getX({x: x, y: y});
		ok(getX === x, '.getX object');

		getY = input._getY({x: x, y: y});
		ok(getY === y, '.getY object');
	});
	test('._incrementCoordinate', function () {
		var c = {x: 2, y: 2},
			by = {x: 1, y: 1};
		input._incrementCoordinate(c, by);
		ok(c.x === 3, 'increment x');
		ok(c.y === 3, 'increment y');
	});
	test('.setCoordinates', function () {
		var x = 10, y = 20,
			set = {pageX: x, pageY: y};

		input.setCoordinates(set);
		ok(input.inputs[0].x === x, 'sets x coordinate');
		ok(input.inputs[0].y === y, 'sets y coordinate');

		ok(input.average.x === x, 'sets x average');
		ok(input.average.y === y, 'sets y average');

		input._touch = true;
		input.setCoordinates({
			touches: [{pageX: x, pageY: y}, {pageX: x * 2, pageY: y * 2}]
		});
		ok(input.inputs.length === 2, 'touch multiple inputs');
		ok(input.average.x === (x + x * 2) / 2, 'average x');
		ok(input.average.y === (y + y * 2) / 2, 'average y');
		input._touch = false;
	});
	test('.bindAllInputs', function () {
		input.bindAllInputs();
		ok(input._bound, 'binds input');
	});
	test('.unbindAllInputs', function () {
		input.unbindAllInputs();
		ok(!input._bound, 'binds input');
	});
	test('.destroy', function () {
		ok(input.destroy(), 'destroys');
		ok(input.options === input._defaultOptions, 'resets to default options');
	});
}(window));
