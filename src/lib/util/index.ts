import * as prettyHrtime from "pretty-hrtime";
import * as chalk from "chalk";
import * as timestamp from "time-stamp";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { spawn } from "child_process";

/**
 * @private
 * @param {string} param - String for log error.
 */
export function error(param: string): void{
	let output: string = "";
	output+= "- "+chalk.red(timestamp("HH:mm:ss"));
	output+= " "+param+" ";
	console.log(output);
};

/**
 * @private
 */
export function log(param: string, time?: string): void{
	let output: string = "";
	if(time){
		time = chalk.magenta(time);
	}
	output+= "- "+timestamp("HH:mm:ss");
	output+= " "+param+" ";
	output+= time || "";
	console.log(output);
}

/**
 * @private
 * @param {object} object - Object to treat.
 */
export function shiftObject(object){
	let key: string = Object.keys(object)[0];
	let firstObject = object[key];
	delete object[key];
	return firstObject;
}

/**
 * @private
 * @param {object} param
 */
export function execute(param): void{
	let { task: { entry: entry, command: command} } = param;
	if(entry){
		executeEntry(param)
	}
	if(command){
		executeCommand(param);
	}
}
/**
 * @private
 * @param {object} param
 */
 export function executeEntry(param): void{
	let { that, task, tasksRun, callback } = param;
	let cp = spawn(process.execPath, [task.entry]);
	cp.stdout.on("data", (data) => {
		let args = getArgsStout(task);
		if(data){
			process.stdout.write(`${data}`);
		}
		that.emit("finish_task", args);
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
 }

/**
 * @private
 * @param {object} param
 */
export function executeCommand(param): void{
	let { task, that, task : { command: cmd }}  = param;
	let chunksCommand: string[] = cmd.split(/\s/);
	let [command, ...args] = chunksCommand;
	command = getCommandForPlatform(command);
	let pathAbsolute: string = path.resolve(`./node_modules/.bin/${command}`);
	let start = process.hrtime();
	let cp = spawn(pathAbsolute, args);
	
	cp.stdout.on('data', (data) => {
		let args = getArgsStout(task);
		process.stdout.write(`${data}`);
		that.emit("finish_task", args);
	});

	cp.stderr.on('data', (data) => {
		process.stdout.write(`${data}`);
	});
}

function updateTime(){
	return process.hrtime();
 }

/**
 * @private
 * @param {object} param
 */
function getArgsStout(task){
	let args = <any>{};
	//args.time = prettyHrtime(end, {precise:true});
	args.task = task.alias;
	return args;
 }

/**
 * @private
 * @param {string} command
 */
function getCommandForPlatform(command: string): string{
	if(process.platform === "win32" )
		return `${command}.cmd`;
	return command;
}
