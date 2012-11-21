var fs = require('fs'),
	http = require('http')

http.createServer().on('request', function (req, res) {
	console.log(req.url)
	fs.readFile(__dirname+req.url, 'utf-8', function (err, txt) {
		if (err) {
			console.log(err)
			return
		}
		res.writeHead(200, {'Content-Type': 'text/plain'})
		if (txt.match(/^\s*define/)) res.write(txt)
		else res.write('define(function (require, exports, module) {\n'+txt+'\n});')
		res.end()
	})
}).listen(8080, 'localhost');
