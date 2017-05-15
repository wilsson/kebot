/**
 * @private
 */
 
export class Validate{
	public string(entity: string): void{
		if(entity && typeof entity !== 'string'){
			throw new Error(`${entity} needs to be a string`);
		}
	}
	public array(entity: string[]): void{
		if(!Array.isArray(entity)){
			throw new Error(`${entity} needs to be a array`);
		}
	}
	public execute(type: string, alias: string[] | string): void{
		let that = this;
		that[type].apply(that, [].slice.call(arguments, 1));
	}
}