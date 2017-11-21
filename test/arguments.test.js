

var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

var path = require('path');

var bin = path.join(__dirname, './../bin/kebot');
var execOption = {
    shell: true
};
var execSyncOption = {
    stdio: "pipe",
    shell: true
};;

test('argument miss', () => {
    let command = execSync(`node ${bin} task:args-miss -t`, execSyncOption);
    console.log('command',command);
    expect(command.toString().split('\n').slice(1).join('')).toEqual('execute task');
});

test('argument contain "args" in flag --args', (done) => {
    exec(`$(which node) ${bin} task:args  --args args -t`, (err,stdout)=>{
        expect(stdout.split('\n').slice(1).join('')).toEqual('args');
        done();
    },execOption);
});

test('argument environment in flag --env', (done) => {
    exec(`$(which node) ${bin} task:env  --env production -t`, (err, stdout)=>{
        expect(stdout.split('\n').slice(1).join('')).toEqual('true');
        done();
    },execOption);
});

test('arguments multiples flags "--email" and "--template"', (done) => {
    exec(`$(which node) ${bin} task:args-multiple  --email juanpablocs21@gmail.com --template register-action -t`, (err, stdout)=>{
        const expected = ['juanpablocs21@gmail.com', 'register-action'];
        expect(stdout.split('\n').slice(1)).toEqual(expect.arrayContaining(expected));
        done();
    },execOption);
});
