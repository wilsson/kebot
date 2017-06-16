import * as chalk from "chalk";
import * as timestamp from "time-stamp";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { spawn } from "child_process";

/**
 * @desc Log error for task
 * @param {string} param - String for log error.
 */
export function error(param: string): void{
	let output: string = "";
	output+= `- ${chalk.red(timestamp("HH:mm:ss"))}`;
	output+= ` ${param} `;
	console.log(output);
};

/**
 * @desc Log for task
 * @param {string} param - Text for log.
 * @param {string} time - The time.
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
 * @desc Execute task
 * @param {object} task - Config Task.
 * @param {string} type - Type task sequential or parallel.
 */
export function execute(task, type: string){
	let binPath :string = path.resolve("./node_modules/.bin");
	let execPath : string;
	let execArgs : string;
	let command : string;
	let args: string[];

	let options = {
		stdio: "inherit",
		shell:true
	};

	let {
		command: cmd,
		entry: entry,
		local: local,
		alias:alias
	} = task;
	
	if(entry){
		execPath = process.execPath;
		command = `${execPath} ${entry}`
	}
	if(cmd){
		let chunksCommand: string[] = cmd.split(/\s/);
		[command, ...args] = chunksCommand;
		command = getCommandCrossPlatform(command);
		command = local ? path.resolve(binPath, command) : command;
		command = `${command} ${args.join(" ")}`;
	}

	if(type === "sync"){
		return executeSync(command, options);
	}
	return executeASync(command, options);
}

/**
 * @desc Execute task sequential
 * @param {string} command - Command execute.
 * @param {object} options - Options process.
 */
function executeSync(command, options){
	console.log("ejecutando comando >", command);
	execSync(command, options);
}

/**
 * @desc Execute task parallel
 * @param {string} command - Command execute.
 * @param {object} options - Options process.
 */
function executeASync(command, options){
	spawn(command, options);
}

/**
 * @param {string} command
 */
function getCommandCrossPlatform(command: string): string{
	if(process.platform === "win32" )
		return `${command}.cmd`;
	return command;
}