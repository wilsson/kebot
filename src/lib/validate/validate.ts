/**
 * @private
 */
 
export class Validate{
	string(entity: string){
		if(entity && typeof entity !== 'string'){
			throw new Error(`${entity} needs to be a string`);
		}
	}
	array(entity: string[]){
		if(!Array.isArray(entity)){
			throw new Error(`${entity} needs to be a array`);
		}
	}
	execute(type: string, alias: string[] | string){
		let that = this;
		that[type].apply(that, [].slice.call(arguments, 1));
	}
}