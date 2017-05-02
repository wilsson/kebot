import prettyHrtime from "pretty-hrtime";
import chalk from "chalk";
import timestamp from "time-stamp";
import { exec } from "child_process";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

/**
 * @private
 * @param {string} param - String for simple log.
 */


/**
 * @private
 * @param {string} param - String for log error.
 */
log.error = function(param){
	let output = "";
	output+= `(${chalk.red(timestamp("HH:mm:ss"))})`;
	output+= param;
	console.log(output);
};

/**
 * @private
 */
export function log(param, time){
	let output = "";
	if(time){
		time = chalk.magenta(time);
	}
	output+= `(${chalk.cyan(timestamp("HH:mm:ss"))})`;
	output+= param+" ";
	output+= time || "";
	console.log(output);
}

/**
 * @private
 * @param {object} object - Object to treat.
 */
export function shiftObject(object){
	let key = Object.keys(object)[0];
	let firstObject = object[key];
	delete object[key];
	return firstObject;
}
/**
 * @private
 * @param {object} param
 */
 export function getArgsStout(task, end){
 	let args = {};
	args.time = prettyHrtime(end);
	args.task = task.alias;
 	return args;
 }

/**
 * @private
 * @param {object} param
 */
export function execute(param){
	let {that, task, tasksRun, callback} = param;
	let cp;
	let dataExist = false;
	if(task.entry){
		let start = process.hrtime();
		cp = spawn(process.execPath, [task.entry]);
		cp.stdout.on("data", (data) => {
			dataExist = true;
			let end = process.hrtime(start);
			let args = this.getArgsStout(task, end);
			that.emit("finish_task", args);
            if(data){
			    process.stdout.write(`${data}`);
            }
			if(callback && typeof callback === "function"){
				callback(tasksRun);
			}
		});

		cp.stderr.on('data', (data) => {
			if(data){
				process.stdout.write(`${data}`);
				return;
			}
		});

		
		cp.on('close', (code) => {
			if(!dataExist){
				let end = process.hrtime(start);
			  	let args = this.getArgsStout(task, end);
				that.emit("finish_task", args);
			}
		});
		
	}
}

/**
 * @private
 * @param {object} param
 */
export function executeCommand(param){
	let { task : { command: cmd }}  = param;
	let chunksCommand = cmd.split(/\s/);
	let [command, ...args] = chunksCommand;
	command = getCommandForPlatform(command);
	let pathAbsolute = path.resolve(`./node_modules/.bin/${command}`);
	let runCommand = spawn(pathAbsolute, args);
	let output = "";
	output+="\n";
	output+=chalk.bold(`> Command: ${command} \n`);
	output+=chalk.bold(`> Args: ${args.join(" ")} \n`);
	process.stdout.write(output);
	runCommand.stdout.on('data', (data) => {
		process.stdout.write(`${data}`);
	});
	runCommand.stderr.on('data', (data) => {
		process.stdout.write(`${data}`);
	});
	/*
	runCommand.on('close', (code) => {
		  console.log(`runCommand child process exited with code ${code}`);
	});*/
}

function getCommandForPlatform(command){
	if(process.platform === "win32" )
		return `${command}.cmd`;
	return command;
}
