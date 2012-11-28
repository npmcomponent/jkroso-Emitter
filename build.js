var fs = require('fs'),
    Glue = require('gluejs');

new Glue()
    .include('src/index.js')
    .main('src/index.js')
    .export('Emitter')
    .render(function (err, txt) {
        fs.writeFile('dist/Emitter.js', txt);
    });