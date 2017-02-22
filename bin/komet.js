#!/usr/bin/env node

var exec = require('child_process').exec;
var argv = require('minimist')(process.argv.slice(2));
var interpret = require('interpret');
var Liftoff = require('liftoff');
var task = argv._;
var cli = new Liftoff({
	name: 'komet',
	extensions: interpret.jsVariants
});

var callback = function(env){
	//console.log('env.modulePath >', env.modulePath);
	//console.log('env.configPath >', env.configPath);
	require(env.configPath);
	var instKomet = require(env.modulePath);
	//console.log('inst>', instKomet);
	instKomet.start.apply(instKomet, task);
};

cli.launch({
	cwd: argv.cwd,
	configPath: argv.kometfiles,
	require: argv.require
}, callback);

