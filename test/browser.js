var mocha = require('mocha')

mocha.setup('bdd')

require('./Emitter.test.js')
require('./light.test.js')

mocha.run(function () {
	console.log('Done!')
})
