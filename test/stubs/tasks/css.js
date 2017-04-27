var fs = require('fs');
var postcss = require('postcss');
var autoprefixer = require('autoprefixer');

fs.readFile('src/css/index.css', function(err, css){
    postcss([autoprefixer])
        .process(css, { from: 'src/index.css', to: 'public/index.css' })
        .then(function(result){
            fs.writeFile('public/index.css', result.css);
            if(result.map){
                fs.writeFile('public/index.css.map', result.map);
            };
        });
});

console.log("process.env.production>");