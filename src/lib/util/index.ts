import * as prettyHrtime from "pretty-hrtime";
import * as chalk from "chalk";
import * as timestamp from "time-stamp";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
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

/**
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
 * @desc Run the path of your node script.
 * @param {object} param
 */
 export function executeEntry(param): void{
	let { that, task, tasksRun, callback } = param;
	let cp = spawn(process.execPath, [task.entry]);
	let start = process.hrtime();
	cp.stdout.on("data", (data) => {
		let end = process.hrtime(start);
		let args = getArgsStout(task, end);
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
			that.emit("task_error", task.alias);
			process.stdout.write(`${data}`);
			return;
		}
	});
 }

/**
 * @desc Execute command CLI installed locally.
 * @param {object} param
 */
export function executeCommand(param): void{
	let {that, task, task : { command: cmd }, tasksRun, callback}  = param;
	let chunksCommand: string[] = cmd.split(/\s/);
	let [command, ...args] = chunksCommand;
	command = getCommandForPlatform(command);
	let pathAbsolute: string = path.resolve(`./node_modules/.bin/${command}`);
	let start = process.hrtime();
	let cp = spawn(pathAbsolute, args);
	let status: boolean = true;
	let _args;
	cp.stdout.on('data', (data) => {
		let end = process.hrtime(start);
		if(status){
			_args = getArgsStout(task, end);
			status = false;
		}else{
			_args = {
				task:task.alias
			};
		}
		process.stdout.write(`${data}`);
		that.emit("finish_task", _args);
		if(callback && typeof callback === "function"){
			callback(tasksRun);
		}
	});

	cp.stderr.on('data', (data) => {
		that.emit("task_error", task.alias);
		process.stdout.write(`${data}`);
	});
}

/**
 * @param {object} param
 */
function getArgsStout(task, end){
	let args = <any>{};
	args.time = prettyHrtime(end);
	args.task = task.alias;
	return args;
 }

/**
 * @param {string} command
 */
function getCommandForPlatform(command: string): string{
	if(process.platform === "win32" )
		return `${command}.cmd`;
	return command;
}
