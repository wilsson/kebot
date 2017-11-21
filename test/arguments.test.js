

var execSync = require('child_process').execSync;
var path = require('path');

var bin = path.join(__dirname, './../bin/kebot');

test('argument miss', () => {
    let command = execSync(`node ${bin} task:args-miss -t`);

    expect(command.toString().split('\n').slice(1).join('')).toEqual('execute task');
});

test('argument contain "args" in flag --args', () => {
    let command = execSync(`node ${bin} task:args  --args args -t`);

    expect(command.toString().split('\n').slice(1).join('')).toEqual('args');
});

test('arguments multiples flags "--email" and "--template"', () => {
    const command = execSync(`node ${bin} task:args-multiple  --email juanpablocs21@gmail.com --template register-action -t`);
    const expected = ['juanpablocs21@gmail.com', 'register-action'];

    expect(command.toString().split('\n').slice(1)).toEqual(expect.arrayContaining(expected));
});
