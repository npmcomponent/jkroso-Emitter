
var inherit = require('inherit')
var chai = require('./chai')
var Emitter = require('..')
var sentinel = {}

function noopA(){}
function noopB(){}

function hasSubscription(topic, fn, context){
	var calls = emitter._events[topic]
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

function notSubscription(topic, fn, context){
	var calls = emitter._events[topic]
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

var emitter
var spy
beforeEach(function () {
	emitter = new Emitter
	spy = chai.spy()
})

describe('Instantiate', function () {
	it('Should be an instance of Emitter', function () {
		new Emitter().should.be.an.instanceOf(Emitter)
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
			'once',
			'hasSubscription'
		])
	})
})

describe('.on(events, fn, context)', function () {
	it('should register the callback', function () {
		emitter.on('test', noopA)
		hasSubscription('test', noopA)
	})

	it('should be able to subscribe multiple functions per event', function () {
		emitter.on('test', noopA, emitter)
		emitter.on('test', noopB, emitter)
		hasSubscription('test', noopA, emitter)
		hasSubscription('test', noopB, emitter)
	})

	it('should default the context to the current this value', function () {
		emitter.on('test', noopA)
		hasSubscription('test', noopA, emitter)
	})

	it('should return `this`', function () {
		emitter.on('test', noopA).should.equal(emitter)
	})
})

describe('.emit(event [, ...])', function () {
	it('Should fire in the order functions were subscribed', function () {
		var c = 0
		
		emitter.on('emitter', function () {
			(++c).should.equal(1)
		})
		
		emitter.on('emitter', function () {
			(++c).should.equal(2)
		})
		
		emitter.emit('emitter')
		c.should.equal(2)
	})
	
	it('Should call functions with their specified context', function (done) {
		emitter.on('test', function (d) {
			this.should.equal(sentinel)
			done()
		}, sentinel)
		emitter.emit('test')
	})
	
	it('should pass data to each handler', function (done) {
		emitter.on('test', function (d) {
			d.should.equal(sentinel)
			done()
		})
		emitter.emit('test', sentinel)
	})

	it('should pass all extra arguments to the handler', function () {
		emitter.on('emitter', function () {
			arguments.should.deep.equal([1,2,3,4,5])
		})
		emitter.emit('emitter', 1,2,3,4,5)

		emitter.on('b',function () {
			arguments.should.deep.equal([1,2])
		})
		emitter.emit('b', 1,2)
	})

	it('should return `this`', function () {
		emitter.emit('test', noopA).should.equal(emitter)
	})
})

describe('.off()', function () {
	it('Should remove all topics', function () {
		emitter.on('rad', function () {})
		emitter.on('test', function () {})
		emitter.off()
		Object.keys(emitter._events).length.should.equal(0)
	})

	it('should return `this`', function () {
		emitter.off().should.equal(emitter)
	})
})

describe('.off(topic)', function () {
	it('Should clear all under the given topic', function () {
		emitter.on('test', function () {})
		emitter.on('test', function () {})
		emitter.off('test')
		should.not.exist(emitter._events.test)
	})

	it('should return `this`', function () {
		emitter.off('test').should.equal(emitter)
	})
})

describe('.off(events, fn)', function () {
	it('Should remove subscriptions which match both the topic and fn', function () {
		emitter.on('test', noopA)
		emitter.off('test', noopA)
		notSubscription('test', noopA, emitter)
	})

	it('Should not remove other subscriptions', function () {
		emitter.on('test', noopA)
		emitter.on('test', noopB)
		emitter.off('test', noopA)
		notSubscription('test', noopA, emitter)
		hasSubscription('test', noopB, emitter)
	})

	it('should remove all matching functions', function () {
		emitter.on('test', noopA, sentinel)
		emitter.on('test', noopA, noopB)
		emitter.off('test', noopA)
		notSubscription('test', noopA)
	})

	it('should return `this`', function () {
		emitter.off('test', noopA).should.equal(emitter)
	})
})

describe('.off(topic, fn, context)', function () {
	it('should remove only the subscriptions which match both context and fn', function () {
		emitter.on('test', noopA, noopB)
		emitter.on('test', noopA, sentinel)
		emitter.off('test', noopA, sentinel)
		notSubscription('test', noopA, sentinel)
		hasSubscription('test', noopA, noopB)
	})

	it('should return `this`', function () {
		emitter.off('test', noopA, sentinel).should.equal(emitter)
	})
})

describe('.once()', function () {
	it('should remove the subscription after once call', function () {
		var c = 0
		emitter.once('test', function () {
			c++
		})
		emitter.emit('test')
		emitter.emit('test')
		c.should.equal(1)
	})

	it('should return `this`', function () {
		emitter.once('test', noopA).should.equal(emitter)
	})
})

describe('.hasSubscription()', function () {
	describe('with just a `topic`', function () {
		it('should detect any subscription on `topic`', function () {
			emitter.on('test', function(){})		
			emitter.hasSubscription('test').should.be.true		
			emitter.hasSubscription('a').should.be.false
		})
	})

	describe('with a `topic` and a `function`', function () {
		it('should detect a match of `topic` and `function`', function () {
			emitter.on('test', noopA)		
			emitter.hasSubscription('test', noopA).should.be.true
			emitter.hasSubscription('test', function(){}).should.be.false
		})
	})

	describe('with the a `context` argument aswell', function () {
		it('should also check that matches', function () {
			emitter.on('test', noopA, sentinel)
			emitter.hasSubscription('test', noopA, sentinel).should.be.true
			emitter.hasSubscription('test', noopA, {}).should.be.false
		})

		it('should continue searching after failing only on `ctx`', function () {
			emitter.on('a', noopA, sentinel)
			emitter.on('a', noopA, {})
			emitter.on('b', noopA, {})
			emitter.on('b', noopA, sentinel)
			emitter.hasSubscription('a', noopA, sentinel).should.be.true
			emitter.hasSubscription('b', noopA, sentinel).should.be.true
		})
	})
})

describe('with inheritance', function(){
	var Sub
	beforeEach(function(){
		Sub = function Sub(){}
		inherit(Sub, Emitter)
		Sub.prototype.on('a', spy)
	})
	it('should be able to define subscription on prototypes', function(){
		new Sub().emit('a')
		spy.should.have.been.called()
	})

	it('should be able to add subscriptions to instances', function(){
		var emitter = new Sub
		emitter.on('b', spy)
		Sub.prototype.emit('b')
		spy.should.not.have.been.called()
		emitter.emit('b')
		spy.should.have.been.called()
	})
})