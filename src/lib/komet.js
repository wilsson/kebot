import EventEmitter from 'events';
import validate from './validate';
import * as _ from './util';

/**
 * @since 0.0.1
 * @example
 * var komet = require("komet");
 *
 * komet.task({
 *  alias:'task-one',
 *  entry:'task-one.js'
 * });
 */
export class Komet extends EventEmitter{

	/**
	 * @private
	 */
	constructor(){
		super();
		/**
		 * @private
		 */
		this.tasks = {};
	}

	/**
	 * @private
	 * @desc Method for validate task.
	 * @param {Object} config - Task configuration object.
	 * @return {Object} task - Subscribed task.
	 */
	validateTask(config){
		let {alias, entry, dependencies} = config;
		let task = {};
		validate.execute('string', alias);
		validate.execute('string', entry);
		if(config.dependencies){
			validate.execute('array', dependencies);
			for(const dependence of dependencies){
				validate.execute('string', dep);
			}
		}
		task[alias] = config;
		return task;
	}

	/**
	 * @desc Method for creating a task.
	 * @param {Object} config - Task configuration object.
	 * @param {string} config.alias - The alias of your task.
	 * @param {string} config.entry - The path of your node script.
	 * @param {Array} config.dependsof - Task dependencies.
	 */
	task(config){
		let task = this.validateTask(config);
		Object.assign(this.tasks, task);
	}
	/**
	 * @private
	 * @param {array} tastas - kask from cli.
	 * @param {boolean} option - Whether it is dependent or not.
	 */
	start(task, option, env){
        this.createEnv(env);
		let foundTask;
		let type;
		if(!task){
			throw new Error('Not alias task for argument');
		}
		for(let alias in this.tasks){
			if(alias === task){
				foundTask = this.tasks[alias];
			}
		}

		if(foundTask){
			type = this.verifyTypeTask(foundTask);
			switch(type){
				case "ENTRY":
					this.initEntry(foundTask, option);
					break;
				case "COMMAND":
					this.initCommand(foundTask);
					break;
			}
		}else{
			this.emit('task_not_found', task);
		}
	}
    createEnv(env){
        process.env[env] = env;
    }

	/**
	 * @private
	 * @param {Object} foundTask - Task found.
	 * @return {string} type - Type of task.
	 */
	verifyTypeTask(foundTask){
		let { entry, command } = foundTask;
		let type;
		if(entry){
			type = "ENTRY";
		}
		if(command){
			type = "COMMAND";
		}
		return type;
	}

	/**
	 * @private
	 * @param {Object} task - Task found.
	 * @param {boolean} option -Whether it is dependent or not.
	 */
	initEntry(task, option){
		let param = {
			that:this,
			task:task
		};
		if(task.dependsof && option){
			this.dependencies(task);
		}else{
			_.execute(param);
		}
		if(!task.entry && !option && task.dependsof){
			this.emit("task_not_entry", task);
		}
	}

	/**
	 * @private
	 * @param {Object} task - Task found.
	 */
	initCommand(task){
		let param = {
			that:this,
			task:task
		};
		_.executeCommand(param);
	}

	/**
	 * @private
	 * @param {object} task - Configuration to run the script with dependencies.
	 */
	dependencies(task){
		let tasksRun = {};
		let lengthTask = task.dependsof.length;
		for(let alias in this.tasks){
			for(let i = 0; i < lengthTask; i++){
				if(alias === task.dependsof[i]){
					tasksRun[alias] = this.tasks[alias];
				}
			}
		}
		tasksRun[task.alias] = task;
		this.dependenciesRun(tasksRun);
	}

	/**
	 * @private
	 * @param {object} tasksRun - All configurations to run.
	 */
	dependenciesRun(tasksRun){
		let task;
		let params;
		let runRecursive = (tasksRun)=>{
			if(Object.keys(tasksRun).length){
				task = _.shiftObject(tasksRun);
				params = {
					that:this,
					task:task,
					tasksRun:tasksRun,
					callback:runRecursive
				};
				_.execute(params);
			}
		};
		runRecursive(tasksRun);
	}
}
