

var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

var path = require('path');

var bin = path.join(__dirname, './../bin/kebot');

test('argument miss', (done) => {
    exec(`$(which node) ${bin} task:args-miss -t`, (err, stdout)=>{
        expect(stdout.split('\n').slice(1).join('')).toEqual('execute task');
        done();
    });
});

test('argument contain "args" in flag --args', (done) => {
    exec(`$(which node) ${bin} task:args  --args args -t`, (err,stdout)=>{
        expect(stdout.split('\n').slice(1).join('')).toEqual('args');
        done();
    });
});

test('argument environment in flag --env', (done) => {
    exec(`$(which node) ${bin} task:env  --env production -t`, (err, stdout)=>{
        expect(stdout.split('\n').slice(1).join('')).toEqual('true');
        done();
    });
});

test('arguments multiples flags "--email" and "--template"', (done) => {
    exec(`$(which node) ${bin} task:args-multiple  --email juanpablocs21@gmail.com --template register-action -t`, (err, stdout)=>{
        const expected = ['juanpablocs21@gmail.com', 'register-action'];
        expect(stdout.split('\n').slice(1)).toEqual(expect.arrayContaining(expected));
        done();
    });
});
