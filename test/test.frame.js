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
			frame = new FIT.Frame();
		},
		teardown: function () {
			frame.destroy();
		}
	});
	test('instantiation', function () {
		ok(typeof frame === 'object', 'returns a type of object');
	});
	asyncTest('.step, .start, .stop', function () {
		expect(1);
		var frameCount = 0;
		frame.step = function () {
			frameCount++;
			frame.stop();
		};
		window.setTimeout(function () {
			ok(frameCount > 0, 'frame started, increased count and stopped.');
		}, 0);
		start();
		frame.start();
	});
	test('.destroy', function () {
		ok(frame.destroy(), 'destroys');
		ok(frame.options === frame._defaultOptions, 'resets to default options');
	});
}(window));
