'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.shiftObject = shiftObject;
exports.execute = execute;

var _child_process = require('child_process');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {object} object - Object to treat.
 */
function shiftObject(object) {
	var key = Object.keys(object)[0];
	var firstObject = object[key];
	delete object[key];
	return firstObject;
}

/**
 * @param {string} entry - Script path.
 * @param {object} tasksRun - All configurations to run.
 * @param {function} callback
 */
function execute(entry, tasksRun, callback) {
	if (!_fs2.default.existsSync(entry)) {
		throw new Error('Task file ' + entry + ' not found');
	}
	(0, _child_process.exec)('node ' + entry, function (error, stout, stderr) {
		if (error) {
			console.log(error);
			return;
		}
		console.log(stout.trim());
		if (callback && typeof callback === 'function') {
			callback(tasksRun);
		}
	});
}