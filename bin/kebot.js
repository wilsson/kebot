#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interpret = require("interpret");
var Liftoff = require("liftoff");
var util = require("../lib/util");
var path_1 = require("path");
var argv = require('minimist')(process.argv.slice(2));
var argTask = String(argv._[0]);
var envKebot = argv.env;
var argsKomet = argv;
var option = argv.a || false;
/**
 * @desc Instance of Liftoff.
 */
var cli = new Liftoff({
    name: 'kebot',
    extensions: interpret.jsVariants
});
var argVersion = argv.v || argv.version;
var argHelp = argv.help;
var versionCli = require("../package.json").version;
/**
 * @desc Callback for initialize aplication.
 * @param {Object} env - Instance of Liftoff.
 */
var callback = function (env) {
    var modulePackage = env.modulePackage, modulePath = env.modulePath, configPath = env.configPath;
    var instKebot;
    var args;
    if (argVersion && !argv._.length) {
        util.log("CLI version " + versionCli);
        if (modulePackage && typeof modulePackage.version !== "undefined") {
            util.log("Local version " + modulePackage.version);
        }
        process.exit();
    }
    // mode testing flag -t
    if (argv.t) {
        configPath = path_1.resolve('./test/fixture/kebotfile.js');
        modulePath = path_1.resolve('./lib/index.js');
    }
    if (!modulePath) {
        util.log("Local kebot not found");
        process.exit();
    }
    if (!configPath) {
        util.log("No kebotfile found");
        process.exit();
    }
    require(configPath);
    instKebot = require(modulePath);
    if (argHelp) {
        console.log("\nKebot version: " + versionCli);
        console.log('Kebot usage: kb <task>\n');
        console.log('Tasks availables:');
        var _tasks = instKebot.tasks;
        var tasks = [];
        for (var task in _tasks) {
            tasks.push({ name: task, description: _tasks[task].description });
        }
        var maxSpace_1 = tasks.reduce(function (max, p) { return p.name.length > max ? p.name.length : max; }, tasks[0].name.length);
        tasks.forEach(function (task) {
            var numSpaces = maxSpace_1 - task.name.length;
            console.log("- kb " + task.name + createSpaces(numSpaces) + " # " + (typeof task.description == 'undefined' ? 'No Description' : capitalizeString(task.description)));
        });
        console.log('\n');
        process.exit();
    }
    loadEvents(instKebot);
    args = {
        argsKomet: argsKomet,
        argTask: argTask,
        option: option,
        envKebot: envKebot
    };
    instKebot.start.call(instKebot, args);
};
/**
 * @param {Object} inst - Instance of kebot.
 */
var loadEvents = function (inst) {
    inst.on("task_not_found", function (e) {
        util.error("Task " + e + " not found");
    });
};
/**
 * @param {Number} total - num of spaces.
 */
var createSpaces = function (total) {
    var s = [];
    for (var i = 0; i < total; i++) {
        s.push(' ');
    }
    return s.join('');
};
/**
 * @param {String} str - Letters.
 */
var capitalizeString = function (str) { return str[0].toUpperCase() + str.slice(1); };
/**
 * @desc Start aplication.
 */
cli.launch({
    cwd: argv.cwd,
    configPath: argv.kebotfile,
    require: argv.require
}, callback);
