var api = require('./helper.js');
//api.mensaje();
console.log(this === module.exports); // true
console.log(this === exports); // true
console.log(module.exports === exports); // true
//api();
