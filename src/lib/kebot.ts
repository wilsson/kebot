/**
 * @author Wilson Flores <wilsonft83@gmail.com>
 * @since 0.0.1
 * @example
 * var kebot = require("kebot");
 *
 * kebot.task({
 *  alias:'task-one',
 *  entry:'task-one.js'
 * });
 */

import { EventEmitter } from 'events';
import validate from './validate';
import * as _ from './util';
import TYPE  from './type';

/**
 * @interface
 * @desc Task - Contract of a task
 */

interface Task{
	alias:string,
	command:string,
	entry:string,
	sequential:string[],
	parallel:string[],
	local:boolean
}

export class Kebot extends EventEmitter{
	/**
     * @type {Object}
	 * @desc Method for validate task.
     */
	tasks = {};

	constructor(){
		super();
	}

	/**
	 * @desc Method for validate task.
	 * @param {Object} config - Task configuration object.
	 */
	validateTask(config: Task){
		let { 
			alias, 
			entry, 
			sequential, 
			parallel, 
			command, 
			local 
		} = config;
		let task = {};
		validate.execute('string', alias);
		validate.execute('string', entry);
		validate.execute('string', command);

		if(sequential){
			validate.execute('array', sequential);
			for(const dependence of sequential){
				validate.execute('string', dependence);
			}
		}

		if(parallel){
			validate.execute('array', parallel);
			for(const dependence of parallel){
				validate.execute('string', dependence);
			}
		}
		config.local = config.hasOwnProperty("local") ? local : false;
		task[alias] = config;
		return task;
	}

	/**
	 * @desc Method for creating a task.
	 * @param {Object} config - Task configuration object.
	 * @param {string} config.alias - The alias of your task.
	 * @param {string} config.entry - The path of your node script.
	 * @param {string} config.command - Command to execute.
	 * @param {Array} config.sequential - Task dependencies sequential.
	 * @param {Array} config.parallel - Task dependencies parallel.
	 */
	task(config: Task): void{
		let task = this.validateTask(config);
		(<any>Object).assign(this.tasks, task);
	}

	/**
	 * @desc Method for creating a task.
	 * @param {string} params.argTask - Command to execute.
	 * @param {string} params.option - Task dependencies sequential.
	 * @param {string} params.envKebot - Task dependencies parallel.
	 */
	start(params): void{
		let { argTask, option, envKebot, argsKomet } = params;
		let foundTask: Task;
		let type: string;
		if(typeof undefined === argTask){
			throw new Error('I did not enter any alias as argument');
		}
		for(let alias in this.tasks){
			if(alias === argTask){
				foundTask = this.tasks[alias];
			}
		}
		if(foundTask){
			this.createEnv(envKebot);
			this.createArgs(argsKomet);
			type = this.verifyTypeTask(foundTask);
			switch(type){
				case TYPE.TASK:
					this.initTask(foundTask, option);
					break;
				case TYPE.TASKS:
					this.initTasks(foundTask);
					break;
			}
		}else{
			this.emit('task_not_found', argTask);
		}
	}
	
	/**
	 * @desc Creates arguments variable.
	 * @param {string} args
	 */
	createArgs(args: string): void{
		if(args){
			process.env = args;
		}
	}

	/**
	 * @desc Creates an environment variable.
	 * @param {string} env - enviroment a create.
	 */
	createEnv(env: string): void{
		if(env){
			process.env[env] = true;
		}
	}

	/**
	 * @desc Verity type task or tasks.
	 * @param {Object} foundTask - Task found.
	 */
	verifyTypeTask(foundTask: Task): string{
		let { entry, command, sequential, parallel } = foundTask;
		let valid: boolean = false;
		let type: string;
		let count: number = 0;

		if(entry && command){
			throw new Error("You can not have entry and commando together");
		}

		if(entry || command){
			type = TYPE.TASK;
		}

		if(!entry && !command){
			type = TYPE.TASKS;
		}

		if (type === TYPE.TASKS) {
			if(!sequential && !parallel){
				process.exit();
			}
		}
		return type;
	}

	/**
	 * @param {Object} task - Task found.
	 * @param {boolean} option - Whether it is dependent or not.
	 */
	initTask(task: Task, option: boolean): void{
		let { sequential, parallel } = task;

		if (parallel && option) {
			throw new Error("You can only have sequential dependency tasks");
		}
		if (sequential && option) {
			this.dependenciesTask(task);
		}else{
			_.execute(task, "sync");
		}
	}

	/**
	 * @param {object} task - Task found.
	 */
	 initTasks(task: Task): void{
		let { sequential, parallel } = task;
		let tasks: string[] = sequential || parallel;
		let type: string = this.getTypeTasks(sequential, parallel);
		let tasksRun = tasks && this.getDependsTasks(tasks);
		if (tasksRun) {
			switch(type){
				case TYPE.SEQUENTIAL:
					this.executeTasks(tasksRun, "sync")
					break;
				case TYPE.PARALLEL:
					this.executeTasks(tasksRun, "async")
					break;
			}
		}
	}

	/**
	 * @param {object} tasks - Tasks to execute.
	 * @param {string} type -  Type of task execution.
	 */
	executeTasks(tasks, type){
		let task: Task;
		for(let task in tasks){
			task = tasks[task]
			_.execute(task, type);
		}
	}

	/**
	 * @param {string} sequential
	 * @param {string} parallel
	 */
	getTypeTasks(sequential: string[], parallel: string[]): string{
		let type: string;
		if (sequential) {
			type = TYPE.SEQUENTIAL;
		}
		if (parallel) {
			type = TYPE.PARALLEL;
		}
		return type;
	 }

	/**
	 * @param {object} task - Configuration to run the script with dependencies.
	 */
	dependenciesTask(task: Task): void{
		let { sequential, alias } = task;
		let tasksRun = this.getDependsTasks(sequential);
		tasksRun[alias] = task;
		this.executeTasks(tasksRun, "sync");
	}

	/**
	 * @param {array} dependencies
	 */
	 getDependsTasks(dependencies: string[]){
		let tasksRun = {};
		for(let dependence of dependencies){
			for(let task in this.tasks){
				if(task === dependence){
					tasksRun[task] = this.tasks[task];
					break;
				}
			}
		}
		return tasksRun;
	 }
}