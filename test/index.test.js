import komet from '../lib';

const demo = {
	alias:"css",
	entry:'./tasks/css.js',
	dependsof:['sprite', 'fonts', 'other']
};

let task = komet.validateTask(demo);
task = task[demo.alias];

test('Alias for task', () => {
    expect(task.alias).toEqual(demo.alias);
});

test('Entry for task', () => {
    expect(task.entry).toEqual(demo.entry);
});

test('Dependencies for task', () => {
    expect(task.dependsof).toEqual(demo.dependsof);
});
