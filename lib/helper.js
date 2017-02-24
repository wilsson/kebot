'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.shiftObject = shiftObject;
exports.execute = execute;

var _child_process = require('child_process');

function shiftObject(task) {
	var key = Object.keys(task)[0];
	var object = task[key];
	delete task[key];
	return object;
}

function execute(entry, tasksRun, callback) {
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