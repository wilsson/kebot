var runjs = require("runjs");

exports.default = {
  js: function js() {
    //runjs.run("docker --version");
    runjs.run('echo $(pwd)', { async:true});
  }
};