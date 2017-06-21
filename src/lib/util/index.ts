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
	let execArgs : string;
	let command : string;
	let args: string[];
	let outputCommand: string;

	let options = {
		stdio: "inherit",
		shell: true
	};

	let {
		command: cmd,
		entry: entry,
		local: local,
		alias:alias
	} = task;
	

	if(entry){
		command = `node ${entry}`;
		outputCommand = entry;
	}
	if(cmd){
		outputCommand = cmd;
		let chunksCommand: string[] = cmd.split(/\s/);
		[command, ...args] = chunksCommand;
		command = local ? getBinCommand(command, args) : command;
		command = `${command} ${args.join(" ")}`;
	}
	console.log(chalk.bold(`Executing ${outputCommand}`));
	if(type === "sync"){
		return executeSync(command, options);
	}
	return executeAsync(command, options);
}

/**
 * @desc Execute task sequential
 * @param {string} command - Command execute.
 * @param {object} options - Options process.
 */
function executeSync(command, options){
	execSync(command, options);
}

/**
 * @desc Execute task parallel
 * @param {string} command - Command execute.
 * @param {object} options - Options process.
 */
function executeAsync(command, options){
	spawn(command, options);
}


/**
 * @desc get bin command package local.
 * @param {string} command - Command execute.
 * @param {string[]} args - Arguments of command.
 * @return {string} Command local package.
 */
function getBinCommand(command: string, args: string[]){
	let cmd = path.resolve(`./node_modules/.bin/${command} ${args.join(" ")}`);	
	return cmd;
}