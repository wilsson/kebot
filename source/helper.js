import { exec } from 'child_process';

export function shiftObject(task){
	let key = Object.keys(task)[0];
	let object = task[key];
	delete task[key];
	return object;
}

export function execute(entry, tasksRun, callback){
	exec(`node ${entry}`, (error, stout, stderr)=>{
		if(error){
			console.log(error);
			return;
		}
		console.log(stout.trim());
		if(callback && typeof callback === 'function'){
			callback(tasksRun);
		}
	});
}
