var Emitter = require('../src')
  , chai = require('chai')
  , should = chai.should()
  , sentinel = {}

function noopA () {}
function noopB () {}

describe('Emitter', function (a) {

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

	beforeEach(function () {
		a = new Emitter
	})

	describe('Instantiate', function () {
		it('Should be an instance of Emitter', function () {
			new Emitter().should.be.an.instanceOf(Emitter)
		})
		it.skip('Should have no enumerable properties', function () {
			Object.keys(new Emitter).length.should.equal(0)
		})
	})

	describe('.on(events, fn, context)', function () {
		it('Should register the callback', function () {
			a.on('test', noopA, a)
			hasSubscription('test', noopA, a)
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
		it.skip('should return the function which was subscribed', function () {
			
		})
	})

	describe('.emit(event, data)', function () {
		it('Should fire in the order functions were subscribed', function () {
			var c = 0
			a.on('a', function () {
				(++c).should.equal(1)
			}).on('a', function () {
				(++c).should.equal(2)
			}).emit('a')
			c.should.equal(2)
		})
		it('Should call functions with their specified context', function (done) {
			a.on('test', function (d) {
				this.should.equal(sentinel)
				done()
			}, sentinel).emit('test')
		})
		it('should pass data to each handler', function (done) {
			a.on('test', function (d) {
				d.should.equal(sentinel)
				done()
			}).emit('test', sentinel)
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
		it('should should clear multiple events', function () {
			a.on('one | two | three', noopA)
			a.off('one | two')
			hasSubscription('three', noopA)
			notSubscription('one', noopA)
			notSubscription('two', noopA)
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
	
	describe('.off(topics, fn, context)', function () {
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
		it('should unsubsribe from all it was subsribed to', function () {
			var c = 0
			a.once('one | two | three', function () {c++})
			a.emit('two')
			a.emit('three')
			a.emit('one')
			c.should.equal(1)
		})
	})
})