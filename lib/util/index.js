"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prettyHrtime = require("pretty-hrtime");
var chalk = require("chalk");
var timestamp = require("time-stamp");
var path = require("path");
var child_process_1 = require("child_process");
/**
 * @private
 * @param {string} param - String for log error.
 */
function error(param) {
    var output = "";
    output += "(" + chalk.red(timestamp("HH:mm:ss")) + ")";
    output += param;
    console.log(output);
}
exports.error = error;
;
/**
 * @private
 */
function log(param, time) {
    var output = "";
    if (time) {
        time = chalk.magenta(time);
    }
    output += "(" + chalk.cyan(timestamp("HH:mm:ss")) + ")";
    output += param + " ";
    output += time || "";
    console.log(output);
}
exports.log = log;
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
exports.shiftObject = shiftObject;
/**
 * @private
 * @param {object} param
 */
function execute(param) {
    var task = param.task;
    if (task.entry) {
        executeEntry(param);
    }
    if (task.command) {
        executeCommand(param);
    }
}
exports.execute = execute;
/**
 * @private
 * @param {object} param
 */
function executeEntry(param) {
    var that = param.that, task = param.task, tasksRun = param.tasksRun, callback = param.callback;
    var dataExist = false;
    var start = process.hrtime();
    var cp = child_process_1.spawn(process.execPath, [task.entry]);
    cp.stdout.on("data", function (data) {
        dataExist = true;
        var end = process.hrtime(start);
        var args = getArgsStout(task, end);
        that.emit("finish_task", args);
        if (data) {
            process.stdout.write("" + data);
        }
        if (callback && typeof callback === "function") {
            callback(tasksRun);
        }
    });
    cp.stderr.on('data', function (data) {
        if (data) {
            process.stdout.write("" + data);
            return;
        }
    });
    cp.on('close', function (code) {
        if (!dataExist) {
            var end = process.hrtime(start);
            var args = getArgsStout(task, end);
            that.emit("finish_task", args);
        }
    });
}
exports.executeEntry = executeEntry;
/**
 * @private
 * @param {object} param
 */
function executeCommand(param) {
    var task = param.task, that = param.that, cmd = param.task.command;
    var chunksCommand = cmd.split(/\s/);
    var command = chunksCommand[0], args = chunksCommand.slice(1);
    command = getCommandForPlatform(command);
    var pathAbsolute = path.resolve("./node_modules/.bin/" + command);
    var start = process.hrtime();
    var cp = child_process_1.spawn(pathAbsolute, args);
    var output = "";
    output += "\n";
    output += chalk.bold("> Command: " + command + " \n");
    output += chalk.bold("> Args: " + args.join(" ") + " \n");
    process.stdout.write(output);
    cp.stdout.on('data', function (data) {
        var end = process.hrtime(start);
        var args = getArgsStout(task, end);
        that.emit("finish_task", args);
        process.stdout.write("" + data);
    });
    cp.stderr.on('data', function (data) {
        process.stdout.write("" + data);
    });
}
exports.executeCommand = executeCommand;
/**
 * @private
 * @param {object} param
 */
function getArgsStout(task, end) {
    var args = {};
    args.time = prettyHrtime(end);
    args.task = task.alias;
    return args;
}
/**
 * @private
 * @param {string} command
 */
function getCommandForPlatform(command) {
    if (process.platform === "win32")
        return command + ".cmd";
    return command;
}
