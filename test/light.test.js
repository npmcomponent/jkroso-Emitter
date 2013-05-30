
var Emitter = require('../light')
	, chai = require('./chai')

function noopA () {}
function noopB () {}

/**
 * helper to assert the existence of a subscription
 */

function hasSubscription (topic, fn) {
	var calls = emitter._events[topic]
	if (typeof calls == 'function') {
		if (calls !== fn) throw new Error('wrong subscription')
	} else if (calls instanceof Array) {
		if (calls.indexOf(fn) < 0) error()
	} else {
		error()
	}

	function error(){
		throw new Error('Subscription not found in '+topic)
	}
}

/**
 * helper to assert a subscription doesn't exist
 */

function notSubscription (topic, fn) {
	var calls = emitter._events[topic]
	if (typeof calls == 'function') {
		if (calls === fn) error()
	} else if (calls instanceof Array) {
		if (calls.indexOf(fn) >= 0) error()
	}

	function error(){
		throw new Error('subcription exists')
	}
}

var emitter

describe('light.js', function () {
	beforeEach(function () {
		emitter = new Emitter
	})

	describe('sub-classing', function(){
		it('with Emitter.call(this)', function(done){
			function Custom() {
				Emitter.call(this)
			}
			Custom.prototype.__proto__ = Emitter.prototype
			var emitter = new Custom
			emitter.on('foo', done)
			emitter.emit('foo')
		})

		it('without Emitter.call(this)', function (done) {
			function Custom(){}
			Custom.prototype.__proto__ = Emitter.prototype
			var emitter = new Custom
			emitter.on('foo', done)
			emitter.emit('foo')
		})
	})

	describe('Mixin', function () {
		it('should return the target object', function () {
			var o = {}
			Emitter(o).should.equal(o)
		})

		it('should look like an Emitter instance', function () {
			Emitter({}).should.have.keys([
				'emit',
				'on',
				'off',
				'once'
			])
		})
	})

	describe('.on(String, Function)', function () {
		it('should register the callback', function () {
			emitter.on('test', noopA)
			hasSubscription('test', noopA)
		})

		it('should be able to subscribe multiple functions per event', function () {
			emitter.on('test', noopA)
			emitter.on('test', noopB)
			hasSubscription('test', noopA)
			hasSubscription('test', noopB)
		})

		it('should return `this`', function () {
			emitter.on('test', noopA).should.equal(emitter)
		})
	})

	describe('.emit(String, ...)', function () {
		it('Should fire in the order functions were subscribed', function () {
			var c = 0

			emitter.on('a', function () {
				(++c).should.equal(1)
			})
			
			emitter.on('a', function () {
				(++c).should.equal(2)
			})
			
			emitter.emit('a')
			c.should.equal(2)
		})
		
		it('Should call functions in the context of the emitter', function (done) {
			emitter.on('test', function (d) {
				this.should.equal(emitter)
				done()
			})
			emitter.emit('test')
		})
		
		it('should pass data to each handler', function (done) {
			emitter.on('a', function (d) {
				d.should.equal(1)
			})		
			emitter.on('b', function () {
				arguments.should.deep.equal([1,2,3,4,5])
				done()
			})
			emitter.emit('a', 1)
			emitter.emit('b', 1,2,3,4,5)
		})
	})

	describe('.off()', function () {
		it('Should remove all topics', function () {
			emitter.on('rad', function () {})
			emitter.on('test', function () {})
			emitter.off()
			Object.keys(emitter._events).length.should.equal(0)
		})
		
		// its useful occasionally
		it('should maintain identity of the events store', function () {
			var events = emitter._events = {}
			emitter.on('rad', function () {})
			emitter.off()
			emitter._events.should.equal(events)
		})
	})

	describe('.off(String)', function () {
		it('Should clear all under the given topic', function () {
			emitter.on('test', noopA)
			emitter.on('test', noopB)
			emitter.off('test')
			notSubscription('test', noopA)
			notSubscription('test', noopB)
		})
	})

	describe('.off(String, Function)', function () {
		it('Should remove subscriptions which match both the topic and fn', function () {
			emitter.on('test', noopA)
			emitter.off('test', noopA)
			notSubscription('test', noopA)
		})

		it('Should not remove other subscriptions', function () {
			emitter.on('test', noopA)
			emitter.on('test', noopB)
			emitter.off('test', noopA)
			notSubscription('test', noopA)
			hasSubscription('test', noopB)
		})

		it('should remove all matching functions', function () {
			emitter.on('test', noopA)
			emitter.on('test', noopA)
			emitter.off('test', noopA)
			notSubscription('test', noopA)
		})
	})

	describe('.once(String, Function)', function () {
		it('should remove the subscription after once call', function () {
			var c = 0
			emitter.once('test', function () {
				c++
			})
			emitter.emit('test')
			emitter.emit('test')
			c.should.equal(1)
		})
	})
})