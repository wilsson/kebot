"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var timestamp = require("time-stamp");
var path = require("path");
var child_process_1 = require("child_process");
/**
 * @desc log error for task
 * @param {string} param - String for log error.
 */
function error(param) {
    var output = "";
    output += "- " + chalk.red(timestamp("HH:mm:ss"));
    output += " " + param + " ";
    console.log(output);
}
exports.error = error;
;
/**
 * @desc log for task
 */
function log(param, time) {
    var output = "";
    if (time) {
        time = chalk.magenta(time);
    }
    output += "- " + timestamp("HH:mm:ss");
    output += " " + param + " ";
    output += time || "";
    console.log(output);
}
exports.log = log;
/**
 * @param {object} object - Object to treat.
 */
function shiftObject(object) {
    var key = Object.keys(object)[0];
    var firstObject = object[key];
    delete object[key];
    return firstObject;
}
exports.shiftObject = shiftObject;
/**
 * @desc Run the path of your node script.
 * @param {object} param
 */
function execute(param) {
    var that = param.that, _a = param.task, cmd = _a.command, entry = _a.entry, local = _a.local, alias = _a.alias, tasksRun = param.tasksRun, callback = param.callback;
    var execPath;
    var spawnArgs;
    if (entry) {
        execPath = process.execPath;
        spawnArgs = [entry];
    }
    if (cmd) {
        var chunksCommand = cmd.split(/\s/);
        var command = chunksCommand[0], args = chunksCommand.slice(1);
        command = getCommandForPlatform(command);
        execPath = local ? path.resolve("./node_modules/.bin/" + command) : command;
        spawnArgs = args;
    }
    var cp = child_process_1.spawn(execPath, spawnArgs);
    cp.stdout.on("data", function (data) {
        process.stdout.write("" + data);
        if (callback && typeof callback === "function") {
            callback(tasksRun);
        }
    });
    cp.stderr.on('data', function (data) {
        that.emit("task_error", alias);
        process.stdout.write("" + data);
    });
}
exports.execute = execute;
/**
 * @param {string} command
 */
function getCommandForPlatform(command) {
    if (process.platform === "win32")
        return command + ".cmd";
    return command;
}
