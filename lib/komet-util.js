'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shiftObject = shiftObject;
exports.execute = execute;

var _child_process = require('child_process');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _prettyHrtime = require('pretty-hrtime');

var _prettyHrtime2 = _interopRequireDefault(_prettyHrtime);

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
 * @param {object} param
 */
function execute(param) {
  var that = param.that;
  var task = param.task;
  var tasksRun = param.tasksRun;
  var callback = param.callback;
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