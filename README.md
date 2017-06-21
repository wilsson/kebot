[![npm version](https://badge.fury.io/js/kebot.svg)](https://badge.fury.io/js/kebot)
[![Build Status](https://travis-ci.org/wilsson/kebot.svg?branch=master)](https://travis-ci.org/wilsson/kebot)
[![Coverage Status](https://coveralls.io/repos/github/wilsson/kebot/badge.svg?branch=master)](https://coveralls.io/github/wilsson/kebot?branch=master)

## What is kebot?

Kebot is a tool that will help you manage your development scripts as well as locally installed CLI.

## Documentation

For an introduction to our API and more read our [wiki](https://github.com/wilsson/kebot/wiki)!

### kebot API

#### kebot.task(options)
```js
var kebot = require("kebot");

kebot.task({
  alias:"script",
  entry:"./task/script.js"
});
```
#### options

Type: `Object`

##### options.alias

Type: `String`

`alias` Name of the task to use by the CLI.

##### options.entry

Type: `String`

`alias` The path of your node script.

##### options.command

Type: `String`

`command` Run any installed CLI

##### options.sequential

Type: `Array`

`sequential` When you have `option.entry` task dependencies, are executed sequentially and at the end the main task is executed.

When you not have `option.entry` they are only tasks that are executed sequentially.

##### options.parallel

Type: `Array`

`parallel` Tasks that run in sequence without dependency.

##### options.local

type: `Boolean`
`local` In `true` : Run a CLI from a locally installed package, just like npm scripts when to use command input. Default `false`

#### Use cases

- Run any installed CLI, using the `command` property.

```js
var kebot = require("kebot");

kebot.task({
  alias: "list",
  command: "ls -l"
});
```

```bash
kb list
```

 - Run any globally installed CLI with npm, using the `command` property.

```js
var kebot = require("kebot");

kebot.task({
  alias: "build",
  command: "babel -w ./source/ -d ./lib/"
});
```

If you have it installed locally in your project use `local` in `true`, like npm scripts, using the `command` property.

```js
var kebot = require("kebot");

kebot.task({
  alias: "build",
  command: "babel -w ./source/ -d ./lib/",
  local: true
});
```

```bash
kb build
```

- Run a file `script.js`, using the `entry`

```js
var kebot = require("kebot");

kebot.task({
  alias: "task",
  entry: "./task/script.js"
});
```

```bash
kb task
```

- To run a `script.js` file with dependent tasks, using the `sequential` property.

```js
var kebot = require("kebot");

kebot.task({
  alias: "css",
  entry: "./task/css.js",
  sequential: ["fonts", "svg"]
});

kebot.task({
  alias: "css",
  entry: "./task/fonts.js"
});

kebot.task({
  alias: "css",
  entry: "./task/svg.js"
});
```

Use the `-a` flag to execute dependencies.
The order of execution is.

- fonts
- svg
- css

```bash
kb css -a
```

- Execute any `command` or `entry` in parallel, using the `parallel` property.

```js
var kebot = require("kebot");

kebot.task({
  alias: "watch",
  entry: "./task/watch.js"
});

kebot.task({
  alias: "css",
  entry: "./task/css.js"
});

kebot.task({
  alias: "all",
  parallel: ["watch", "css"]
});
```

```bash
kb all
```

- Run a task with an environment, use the flag `--env`

```js
var kebot = require("kebot");

kebot.task({
  alias: "css",
  entry: "./task/css.js"
});
```

Use it in your script with `process.env.production` which is equal to `true`

```bash
kb css --env production
```

- Run a task by passing an argument to your task, use the flag `--args`

```js
var kebot = require("kebot");

kebot.task({
  alias: "css",
  entry: "./task/css.js"
});
```

Use it in your script with `process.env.args` which is equal to `value`

```bash
kb css --args value
```