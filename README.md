## What is komet?
Komet is a tool that will help you manage your development scripts as well as locally installed CLI.
## Documentation
For an introduction to our API and more read our [wiki](https://github.com/wilsson/komet/wiki)!
## Sample `kometfile.js`
```js
// kometfile.js
var komet = require("komet");
komet.task({
  alias:"css",
  entry:"./task-css.js"
});
```
Then run
```bash
komet css
```