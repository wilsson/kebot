'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.log = log;
exports.shiftObject = shiftObject;
exports.execute = execute;
exports.executeCommand = executeCommand;

var _prettyHrtime = require('pretty-hrtime');

var _prettyHrtime2 = _interopRequireDefault(_prettyHrtime);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _timeStamp = require('time-stamp');

var _timeStamp2 = _interopRequireDefault(_timeStamp);

var _child_process = require('child_process');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @private
 * @param {string} param - String for simple log.
 */

/**
 * @private
 * @param {string} param - String for log error.
 */
log.error = function (param) {
	var output = "";
	output += '(' + _chalk2.default.red((0, _timeStamp2.default)("HH:mm:ss")) + ')';
	output += param;
	console.log(output);
};

/**
 * @private
 */
function log(param, time) {
	var output = "";
	if (time) {
		time = _chalk2.default.magenta(time);
	}
	output += '(' + _chalk2.default.cyan((0, _timeStamp2.default)("HH:mm:ss")) + ')';
	output += param + " ";
	output += time || "";
	console.log(output);
}

/**
 * @private
 * @param {object} object - Object to treat.
 */
function shiftObject(object) {
	var key = Object.keys(object)[0];
	var firstObject = object[key];
	delete object[key];
	return firstObject;
}

/**
 * @private
 * @param {object} param
 */
function execute(param) {
	var that = param.that,
	    task = param.task,
	    tasksRun = param.tasksRun,
	    callback = param.callback;

	if (task.entry) {
		var start = process.hrtime();
		(0, _child_process.exec)('node ' + task.entry, function (error, stout, stderr) {
			if (error) {
				that.emit("task_error_entry", task.entry);
				return;
			}
			var end = process.hrtime(start);
			var args = {};
			args.time = (0, _prettyHrtime2.default)(end);
			args.task = task.alias;
			that.emit('finish_task', args);
			console.log(stout.trim());
			if (callback && typeof callback === 'function') {
				callback(tasksRun);
			}
		});
	}
}

/**
 * @private
 */
function executeCommand(param) {
	var task = param.task;

	(0, _child_process.exec)('bash ./node_modules/' + task.command, function (error, stout, stderr) {
		if (error) {
			console.log(error);
			return;
		}
		console.log(stout.trim());
	});
}