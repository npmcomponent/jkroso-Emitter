var Emitter = require('../src')
  , chai = require('chai')
  , should = chai.should()
  , sentinel = {}

function noopA () {}
function noopB () {}

function hasSubscription (topic, fn, context) {
	var calls = a._callbacks[topic]
	calls.should.be.an('array')
	for (var i = 0, len = calls.length; i < len; i+=2) {
		calls[i+1].should.be.a('function')
		if (calls[i+1] === fn) {
			if (context == null) return
			else if (context === calls[i]) return
		}
	}
	throw new Error('Subscription not found in '+topic)
}

function notSubscription (topic, fn, context) {
	var calls = a._callbacks[topic]
	if (!calls) return
	calls.should.be.an('array')
	for (var i = 0, len = calls.length; i < len; i+=2) {
		calls[i+1].should.be.a('function')
		if (calls[i+1] === fn) {
			if (context != null && context !== calls[i]) return
			throw new Error('Subscription should not be found in '+topic)
		}
	}
}
var a 

beforeEach(function () {
	a = new Emitter
})

describe('Instantiate', function () {
	it('Should be an instance of Emitter', function () {
		new Emitter().should.be.an.instanceOf(Emitter)
	})
})

describe.skip('Mixin', function () {
	it('should return the target object', function () {
		var o = {}
		Emitter.mixin(o).should.equal(o)
	})
	it('should look like an Emitter instance', function () {
		Emitter.mixin({}).should.have.keys([
			'emit',
			'on',
			'off',
			'once',
		])
	})
})

describe('.on(event)', function () {
	it('should default to on[Event]', function () {
		a.onEvent = noopA
		a.on('event')
		hasSubscription('event', noopA)
	})
	it('should return the resolved method', function () {
		a.onEvent = noopA
		a.on('event').should.equal(noopA)
	})
	it('should throw if no method can be found', function () {
		(function () {
			a.on('event')
		}).should.throw(Error, /find a method/i)
	})
})

describe('.on(events, fn, context)', function () {
	it('Should register the callback', function () {
		a.on('test', noopA)
		hasSubscription('test', noopA)
	})
	it('Should be able to subscribe multiple functions per event', function () {
		a.on('test', noopA, a)
		a.on('test', noopB, a)
		hasSubscription('test', noopA, a)
		hasSubscription('test', noopB, a)
	})
	it('Should default the context to the current this value', function () {
		a.on('test', noopA)
		hasSubscription('test', noopA, a)
	})
	it('should return the function which was subscribed', function () {
		a.on('test', noopA).should.equal(noopA)
	})
})

describe('.emit(event, data)', function () {
	it('Should fire in the order functions were subscribed', function () {
		var c = 0
		a.on('a', function () {
			(++c).should.equal(1)
		})
		a.on('a', function () {
			(++c).should.equal(2)
		})
		a.emit('a')
		c.should.equal(2)
	})
	it('Should call functions with their specified context', function (done) {
		a.on('test', function (d) {
			this.should.equal(sentinel)
			done()
		}, sentinel)
		a.emit('test')
	})
	it('should pass data to each handler', function (done) {
		a.on('test', function (d) {
			d.should.equal(sentinel)
			done()
		})
		a.emit('test', sentinel)
	})
})

describe('.off()', function () {
	it('Should remove all topics', function () {
		a.on('rad', function () {})
		a.on('test', function () {})
		a.off()
		Object.keys(a._callbacks).length.should.equal(0)
	})
})

describe('.off(topic)', function () {
	it('Should clear all under the given topic', function () {
		a.on('test', function () {})
		a.on('test', function () {})
		a.off('test')
		should.not.exist(a._callbacks.test)
	})
})

describe('.off(events, fn)', function () {
	it('Should remove subscriptions which match both the topic and fn', function () {
		a.on('test', noopA)
		a.off('test', noopA)
		notSubscription('test', noopA, a)
	})
	it('Should not remove other subscriptions', function () {
		a.on('test', noopA)
		a.on('test', noopB)
		a.off('test', noopA)
		notSubscription('test', noopA, a)
		hasSubscription('test', noopB, a)
	})
	it('should remove all matching functions', function () {
		a.on('test', noopA, sentinel)
		a.on('test', noopA, noopB)
		a.off('test', noopA)
		notSubscription('test', noopA)
	})
})

describe('.off(topic, fn, context)', function () {
	it('should remove only the subscriptions which match both context and fn', function () {
		a.on('test', noopA, noopB)
		a.on('test', noopA, sentinel)
		a.off('test', noopA, sentinel)
		notSubscription('test', noopA, sentinel)
		hasSubscription('test', noopA, noopB)
	})
})

describe('.once(events, fn)', function () {
	it('Should only fire once', function () {
		var c = 0
		function fn () {c++}
		a.once('test', fn)    
		a.emit('test')
		a.emit('test')
		c.should.equal(1)
		notSubscription('two', fn)
	})
})
