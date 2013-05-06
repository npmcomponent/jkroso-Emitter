
var b = require('b')
  , Emitter = require('./')

function bench(name){
	return b(name).reporter('json')
}

var emitter = new Emitter
var iters = 1e5

emitter.on('run', function(a,b,c,d){
	// arguments[arguments.length -1]()
})

function write(t){
	process.stdout.write(t)
}

write('[')

bench('arguments.length: 0').run(iters, function (i) {
	emitter.emit('run')
})

write(',')

bench('arguments.length: 1').run(iters, function (i) {
	emitter.emit('run', i)
})

write(',')

bench('arguments.length: 2').run(iters, function (i) {
	emitter.emit('run', i, i)
})

write(',')

bench('arguments.length: 3').run(iters, function (i) {
	emitter.emit('run', i, i, i)
})

write(',')

bench('arguments.length: 4').run(iters, function (i) {
	emitter.emit('run', i, i, i, i)
})

write(']')
