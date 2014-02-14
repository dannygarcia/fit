/*global
	FIT: true,
	module: true,
	test:true,
	asyncTest: true,
	expect: true,
	start: true,
	ok: true
*/

'use strict';

(function () {
	var frame;
	module('Frame', {
		setup: function () {
			frame = new FIT.Frame({
				autoBindInputs: false
			});
		},
		teardown: function () {
			frame.destroy();
		}
	});
	test('instantiation', function () {
		ok(typeof frame === 'object', 'returns a type of object');
	});
	asyncTest('.step, .start, .stop', function () {
		expect(2);
		frame.step = function () {
			ok(true, 'step has been called');
			frame.stop();
		};
		start();
		frame.start();
	});
	test('.destroy', function () {
		ok(frame.destroy(), 'destroys');
		ok(frame.options === frame._defaultOptions, 'resets to default options');
	});
}(window));
