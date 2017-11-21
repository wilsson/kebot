

var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

var path = require('path');

var bin = path.join(__dirname, './../bin/kebot');

test('argument miss', (done) => {
    exec(`node ${bin} task:args-miss -t`, (err, stdout)=>{
        expect(stdout.toString().split('\n').slice(1).join('')).toEqual('execute task');
        done();
    });
});

test('argument contain "args" in flag --args', () => {
    let command = execSync(`$(which node) ${bin} task:args  --args args -t`);

    expect(command.toString().split('\n').slice(1).join('')).toEqual('args');
});

test('argument environment in flag --env', () => {
    let command = execSync(`$(which node) ${bin} task:env  --env production -t`);
    expect(command.toString().split('\n').slice(1).join('')).toEqual('true');
});

test('arguments multiples flags "--email" and "--template"', () => {
    const command = execSync(`$(which node) ${bin} task:args-multiple  --email juanpablocs21@gmail.com --template register-action -t`);
    const expected = ['juanpablocs21@gmail.com', 'register-action'];

    expect(command.toString().split('\n').slice(1)).toEqual(expect.arrayContaining(expected));
});
