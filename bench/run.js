
var Emitter = require(process.argv[3])
var args = Number(process.argv[4])
var subs = Number(process.argv[5])

var emitter = new Emitter

while (--subs >= 0) {
	emitter.on('run', function(){})
}

var a = ['\'run\'']
while (args--) a.push('i')
module.exports = eval('(function(i){emitter.emit('+a.join()+')})')
