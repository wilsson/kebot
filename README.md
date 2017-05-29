[![npm version](https://badge.fury.io/js/kebot.svg)](https://badge.fury.io/js/kebot)
[![Build Status](https://travis-ci.org/wilsson/kebot.svg?branch=master)](https://travis-ci.org/wilsson/kebot)

## What is kebot?

Kebot is a tool that will help you manage your development scripts as well as locally installed CLI.

## Documentation

For an introduction to our API and more read our [wiki](https://github.com/wilsson/kebot/wiki)!

## Sample `kebotfile.js`

```js
// kebotfile.js
var kebot = require("kebot");
kebot.task({
  alias:"css",
  entry:"./task-css.js"
});
```

Then run and see the magic

```bash
kebot css
```