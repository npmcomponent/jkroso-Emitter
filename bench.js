
var b = require('b')
  , Emitter = require('./')
  , Light = require('./light')

function bench(weight, i){
	var args = ['\'run\'']
	var c = 0
	while (c++ < i) args.push('i')
	var ƒ = eval('(function(i){'+weight+'.emit('+args.join()+')})')
	b(weight+': argument.length = '+i)
		.reporter('json')
		.run(iters, ƒ)
}

var emitter = new Emitter
var light = new Light
var iters = 1e5

emitter.on('run', function(a,b,c,d){
	// arguments[arguments.length -1]()
})
light.on('run', function(a,b,c,d){
	// arguments[arguments.length -1]()
})

function write(t){
	process.stdout.write(t)
}

write('[')

for (var i = 0; i < 5; i++) {
	bench('emitter', i)
	write(',')
	bench('light', i)
	if (i != 4) write(',')
}

write(']')
