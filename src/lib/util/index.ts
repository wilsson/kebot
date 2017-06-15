import * as chalk from "chalk";
import * as timestamp from "time-stamp";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { execSync } from "child_process";
import { spawn } from "child_process";

/**
 * @desc log error for task
 * @param {string} param - String for log error.
 */
export function error(param: string): void{
	let output: string = "";
	output+= `- ${chalk.red(timestamp("HH:mm:ss"))}`;
	output+= ` ${param} `;
	console.log(output);
};

/**
 * @desc log for task
 */
export function log(param: string, time?: string): void{
	let output: string = "";
	if(time){
		time = chalk.magenta(time);
	}
	output+= `- ${timestamp("HH:mm:ss")}`;
	output+= ` ${param} `;
	output+= time || "";
	console.log(output);
}

/**
 * @param {object} object - Object to treat.
 */
export function shiftObject(object){
	let key: string = Object.keys(object)[0];
	let firstObject = object[key];
	delete object[key];
	return firstObject;
}

export function executeSync(param){
	let options = {
		stdio: "inherit"
	};

	let {
		command: cmd,
		entry: entry,
		local: local,
		alias:alias
	} = param;

	let execPath: string;
	let execArgs: string;
	if(entry){
		execPath = process.execPath;
		execArgs = entry
	}
	if(cmd){
		let chunksCommand: string[] = cmd.split(/\s/);
		let [command, ...args] = chunksCommand;
		command = getCommandForPlatform(command);
		execPath = local ? path.resolve(`./node_modules/.bin/${command}`) : command;
		execArgs = args.join(" ");
	}
	var buffer = execSync(`${execPath} ${execArgs}`, options);
	if(buffer){
		process.stdout.write(buffer.toString());
	}
}

/**
 * @desc Run the path of your node script.
 * @param {object} param
 */
 export function execute(param): void{
	let { 
		that, 
		task:{
			command: cmd,
			entry: entry,
			local: local,
			alias:alias
		}, 
		tasksRun, 
		callback
	} = param;

	let execPath: string;
	let execArgs: string;

	if(entry){
		execPath = process.execPath;
		execArgs = entry
	}
	if(cmd){
		let chunksCommand: string[] = cmd.split(/\s/);
		let [command, ...args] = chunksCommand;
		command = getCommandForPlatform(command);
		execPath = local ? path.resolve(`./node_modules/.bin/${command}`) : command;
		execArgs = args.join(" ");
	}
	let cp = exec(`${execPath} ${execArgs}`);
	cp.stdout.on("data", (data) => {
		process.stdout.write(`${data}`);
		if(callback && typeof callback === "function"){
			callback(tasksRun);
		}
	});

	cp.stderr.on('data', (data) => {
		that.emit("task_error", alias);
		process.stdout.write(`${data}`);
	});
 }

/**
 * @param {string} command
 */
function getCommandForPlatform(command: string): string{
	if(process.platform === "win32" )
		return `${command}.cmd`;
	return command;
}