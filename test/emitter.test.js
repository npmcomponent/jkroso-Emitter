
var inherit = require('inherit')
var chai = require('./chai')
var Emitter = require('..')

function noopA(){}
function noopB(){}

var emitter

function subscribed(topic, fn){
	if (!Emitter.hasSubscription(emitter, topic, fn)) {
		throw new Error('Subscription not found in ' + topic)
	}
}

function notSubscribed(topic, fn){
	if (Emitter.hasSubscription(emitter, topic, fn)) {
		throw new Error('Subscription found in ' + topic)
	}
}

describe('Emitter', function(){
	var spy
	beforeEach(function(){
		spy = chai.spy()
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

		it('without Emitter.call(this)', function(done){
			function Custom(){}
			Custom.prototype.__proto__ = Emitter.prototype
			var emitter = new Custom
			emitter.on('foo', done)
			emitter.emit('foo')
		})
	})

	describe('Mixin', function(){
		it('should return the target object', function(){
			var o = {}
			Emitter(o).should.equal(o)
		})

		it('should look like an Emitter instance', function(){
			Emitter({}).should.have.keys([
				'emit',
				'on',
				'off',
				'once'
			])
		})
	})

	describe('.on(String, Function)', function(){
		it('should register the callback', function(){
			emitter.on('test', noopA)
			subscribed('test', noopA)
		})

		it('should be able to subscribe multiple functions per event', function(){
			emitter.on('test', noopA)
			emitter.on('test', noopB)
			subscribed('test', noopA)
			subscribed('test', noopB)
		})

		it('should return `this`', function(){
			emitter.on('test', noopA).should.equal(emitter)
		})
	})

	describe('.emit(String, ...)', function(){
		it('Should fire in the order functions were subscribed', function(){
			var c = 0

			emitter.on('a', function(){
				(++c).should.equal(1)
			})

			emitter.on('a', function(){
				(++c).should.equal(2)
			})

			emitter.emit('a')
			c.should.equal(2)
		})

		it('Should call functions in the context of the emitter', function(done){
			emitter.on('test', function(d){
				this.should.equal(emitter)
				done()
			})
			emitter.emit('test')
		})

		it('should pass data to each handler', function(done){
			emitter.on('a', function(d){
				d.should.equal(1)
			})
			emitter.on('b', function(){
				[].slice.call(arguments).should.eql([1,2,3,4,5])
				done()
			})
			emitter.emit('a', 1)
			emitter.emit('b', 1,2,3,4,5)
		})
	})

	describe('.off()', function(){
		it('Should remove all topics', function(){
			emitter.on('rad', function(){})
			emitter.on('test', function(){})
			emitter.off()
			Object.keys(emitter._events).length.should.equal(0)
		})

		// its useful occasionally
		it('should maintain identity of the events store', function(){
			var events = emitter._events = {}
			emitter.on('rad', function(){})
			emitter.off()
			emitter._events.should.equal(events)
		})
	})

	describe('.off(String)', function(){
		it('Should clear all under the given topic', function(){
			emitter.on('test', noopA)
			emitter.on('test', noopB)
			emitter.off('test')
			notSubscribed('test', noopA)
			notSubscribed('test', noopB)
		})
	})

	describe('.off(String, Function)', function(){
		it('Should remove subscriptions which match both the topic and fn', function(){
			emitter.on('test', noopA)
			emitter.off('test', noopA)
			notSubscribed('test', noopA)
		})

		it('Should not remove other subscriptions', function(){
			emitter.on('test', noopA)
			emitter.on('test', noopB)
			emitter.off('test', noopA)
			notSubscribed('test', noopA)
			subscribed('test', noopB)
		})

		it('should remove all matching functions', function(){
			emitter.on('test', noopA)
			emitter.on('test', noopA)
			emitter.off('test', noopA)
			notSubscribed('test', noopA)
		})
	})

	describe('.once(String, Function)', function(){
		it('should remove the subscription after once call', function(){
			var c = 0
			emitter.once('test', function(){
				c++
			})
			emitter.emit('test')
			emitter.emit('test')
			c.should.equal(1)
		})
	})

	describe('.hasSubscription()', function(){
		describe('with just a `topic`', function(){
			it('should detect any subscription on `topic`', function(){
				emitter.on('test', spy)
				Emitter.hasSubscription(emitter, 'test').should.be.true
				Emitter.hasSubscription(emitter, 'a').should.be.false
			})
		})

		describe('with a `topic` and a `function`', function(){
			it('should detect a match of `topic` and `function`', function(){
				emitter.on('test', spy)
				Emitter.hasSubscription(emitter, 'test', spy).should.be.true
				Emitter.hasSubscription(emitter, 'test', function(){}).should.be.false
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
})
