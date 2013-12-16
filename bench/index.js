
var path = require('path')
var resolve = path.resolve
var basename = path.basename
var b = require('b')

var file = __dirname + '/run.js'
var imps = ['index.js', 'bench/node.js']

function run(subs){
	var batch = b(subs+' subscriptions').reporter('table')

	imps.forEach(function(name){
		var path = resolve(__dirname, '..', name)
		var title = basename(name, '.js')
		for (var i = 0; i < 5; i++) {
			batch.addFile(title + ' ('+i+' args)', file, path, i, subs)
		}
	})

	return batch.run(1e4)
}

[1,2,3,4,5].reduce(function(current, next){
	return current.then(run.bind(null, next))
}, run(0))
