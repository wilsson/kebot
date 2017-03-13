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
	 * @desc Method for creating a task.
	 * @param {Object} config - Task configuration object.
	 * @param {string} config.alias - The alias of your task.
	 * @param {string} config.entry - The path of your node script.
	 * @param {Array} config.dependsof - Task dependencies.
	 */
	task(config){
		let {alias, entry, dependencies} = config;
		validate.execute('string', alias);
		validate.execute('string', entry);
		if(config.dependencies){
			validate.execute('array', dependencies);
			for(const dependence of dependencies){
				validate.execute('string', dep);
			}
		}
		this.tasks[alias] = config;
	}

	/**
	 * @private
	 * @param {array} tastas - kask from cli.
	 * @param {boolean} option - Whether it is dependent or not.
	 */
	start(task, option){
		let foundTask;
		if(!task){
			throw new Error('Not alias task for argument');
		}
		for(let alias in this.tasks){
			if(alias === task){
				foundTask = this.tasks[alias];
			}
		}
		if(foundTask){
			this.armedTasks(foundTask, option);
		}else{
			this.emit('task_not_found', task);
		}
	}

	/**
	 * @private
	 * @param {array} tastas - kask from cli.
	 * @param {boolean} option -Whether it is dependent or not.
	 */
	armedTasks(task, option){
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
