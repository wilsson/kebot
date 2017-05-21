#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interpret = require("interpret");
var Liftoff = require("liftoff");
var util = require("../lib/util");
var argv = require('minimist')(process.argv.slice(2));
var argTask = String(argv._[0]);
var envKomet = argv.env;
var option = argv.a || false;
/**
 * @desc Instance of Liftoff.
 */
var cli = new Liftoff({
    name: 'komet',
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
    var instKomet;
    var args;
    if (argVersion && !argv._.length) {
        util.log("CLI version " + versionCli);
        if (modulePackage && typeof modulePackage.version !== "undefined") {
            util.log("Local version " + modulePackage.version);
        }
        process.exit(1);
    }
    if (!modulePath) {
        util.log("Local komet not found");
        process.exit(1);
    }
    if (!configPath) {
        util.log("No kometfile found");
        process.exit(1);
    }
    console.log("configPath>", configPath);
    console.log("modulePath>", modulePath);
    require(configPath);
    instKomet = require(modulePath);
    loadEvents(instKomet);
    args = {
        argTask: argTask,
        option: option,
        envKomet: envKomet
    };
    instKomet.start.call(instKomet, args);
};
/**
 * @param {Object} inst - Instance of komet.
 */
var loadEvents = function (inst) {
    inst.on("finish_task", function (e) {
        util.log("Finish task " + e.task);
    });
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
    configPath: argv.kometfile,
    require: argv.require
}, callback);
