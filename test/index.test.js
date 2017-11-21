var komet = require("../lib");

var demo = {
	alias:"css",
	entry:'./tasks/css.js',
	sequential:["sprite"]
};

var task = komet.validateTask(demo);
task = task[demo.alias];

test('Alias for task', function(){
    expect(task.alias).toEqual(demo.alias);
});

test('Entry for task', function(){
    expect(task.entry).toEqual(demo.entry);
});

test('Dependencies for task', function(){
    expect(task.dependsof).toEqual(demo.dependsof);
});