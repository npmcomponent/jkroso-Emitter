var fs = require('fs'),
    Glue = require('gluejs');

new Glue()
    .include('src/index.js')
    .npm('backbone')
    .main('src/index.js')
    .export(null)
    .render(function (err, txt) {
        fs.writeFile('dist/Emitter.js', txt);
    });