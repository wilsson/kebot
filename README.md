## What is kobol?

kobol is a tool that will help you manage your development scripts as well as locally installed CLI.

## Documentation

For an introduction to our API and more read our [wiki](https://github.com/wilsson/kobol/wiki)!

## Sample `kobolfile.js`

```js
// kobolfile.js
var kobol = require("kobol");
kobol.task({
  alias:"css",
  entry:"./task-css.js"
});
```

Then run

```bash
kobol css
```