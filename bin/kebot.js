#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interpret = require("interpret");
var Liftoff = require("liftoff");
var util = require("../lib/util");
var argv = require('minimist')(process.argv.slice(2));
var argTask = String(argv._[0]);
var envKebot = argv.env;
var option = argv.a || false;
/**
 * @desc Instance of Liftoff.
 */
var cli = new Liftoff({
    name: 'kebot',
    extensions: interpret.jsVariants
});
var argVersion = argv.v || argv.version;
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
    loadEvents(instKebot);
    args = {
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
    inst.on("task_error", function (e) {
        util.error("Error in task " + e);
    });
};
/**
 * @desc Start aplication.
 */
cli.launch({
    cwd: argv.cwd,
    configPath: argv.kebotfile,
    require: argv.require
}, callback);
