#!/usr/bin/env node

var exec = require('child_process').exec;
var argv = require('minimist')(process.argv.slice(2));
var interpret = require('interpret');
var Liftoff = require('liftoff');
var task = argv._[0];
var cli = new Liftoff({
	name: 'komet',
	extensions: interpret.jsVariants
});
var callback = function(env){
	var option = argv.a || false;
	require(env.configPath);
	var instKomet = require(env.modulePath);
	instKomet.start.call(instKomet, task, option);
};

cli.launch({
	cwd: argv.cwd,
	configPath: argv.kometfiles,
	require: argv.require
}, callback);

