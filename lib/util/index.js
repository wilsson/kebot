"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var timestamp = require("time-stamp");
var path = require("path");
var child_process_1 = require("child_process");
var child_process_2 = require("child_process");
/**
 * @desc Log error for task
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
 * @desc Log for task
 * @param {string} param - Text for log.
 * @param {string} time - The time.
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
 * @desc Execute task
 * @param {object} task - Config Task.
 * @param {string} type - Type task sequential or parallel.
 */
function execute(task, type) {
    var execArgs;
    var command;
    var args;
    var outputCommand;
    var options = {
        stdio: "inherit",
        shell: true
    };
    var cmd = task.command, entry = task.entry, local = task.local, alias = task.alias;
    if (entry) {
        command = "node " + entry;
        outputCommand = entry;
    }
    if (cmd) {
        outputCommand = cmd;
        var chunksCommand = cmd.split(/\s/);
        command = chunksCommand[0], args = chunksCommand.slice(1);
        command = local ? getBinCommand(command, args) : command;
        command = command + " " + args.join(" ");
    }
    console.log(chalk.bold("Executing " + outputCommand));
    if (type === "sync") {
        return executeSync(command, options);
    }
    return executeASync(command, options);
}
exports.execute = execute;
/**
 * @desc Execute task sequential
 * @param {string} command - Command execute.
 * @param {object} options - Options process.
 */
function executeSync(command, options) {
    child_process_1.execSync(command, options);
}
/**
 * @desc Execute task parallel
 * @param {string} command - Command execute.
 * @param {object} options - Options process.
 */
function executeASync(command, options) {
    child_process_2.spawn(command, options);
}
/**
 * @desc get bin command package local.
 * @param {string} command - Command execute.
 * @param {string[]} args - Arguments of command.
 * @return {string} Command local package.
 */
function getBinCommand(command, args) {
    var cmd = path.resolve("./node_modules/.bin/" + command + " " + args.join(" "));
    return cmd;
}
