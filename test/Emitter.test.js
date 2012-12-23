var Emitter = require('../src/'),
    chai = require('chai'),
    should = chai.should()

describe('Emitter', function () {
    var a
    var sentinel = {}
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
        it('Should extent the _callbacks property', function () {
            function fn () {
                this.should.equal(a)
            }
            a.on('test', fn, a)
            Object.keys(a._callbacks).length.should.equal(1)
            a._callbacks.test.should.be.an('Array')
            a._callbacks.test[0].should.equal(a)
            a._callbacks.test[1].should.equal(fn)
        })
        it('Should be able to subscribe multiple functions per event', function (done) {
            var c = 0
            function fn () {
                c.should.be.equal(1)
                this.should.be.equal(a)
                done()
            }
            a.on('test', function () {
                this.should.equal(a)
                ;(c++).should.equal(0)
            }, a)
            a.on('test', fn, a)
            a._callbacks.test.length.should.equal(4)
            a.publish('test')
        })
        it('Should default the context to the current this value', function (done) {
            a.on('test', function () {
                this.should.equal(a)
                done()
            })
            a._callbacks.test[0].should.equal(a)
            a._callbacks.test.length.should.equal(2)
            a.publish('test')
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
    describe('.off(events, fn)', function () {
        it('Should remove only the specied fn and its context', function () {
            function fn () {}
            a.on('test', fn, a)
            a.on('test', function a () {}, fn)
            a.off('test', fn)
            a._callbacks.test[0].should.equal(fn)
            a._callbacks.test[1].name.should.equal('a')
        })
        it('Should remove all events if no `events` is passed', function () {
            a.on('rad', function () {})
            a.on('test', function () {})
            a.off()
            Object.keys(a._callbacks).length.should.equal(0)
        })
        it('Should clear all events if no `fn` is passed', function () {
            a.on('test', function () {})
            a.on('test', function () {})
            a.off('test')
            chai.should().not.exist(a._callbacks.test)
        })
        it('should should clear multiple events', function () {
            a.on('one | two | three', function test () {})
            a.off('one | two')
            should.not.exist(a._callbacks.one)
            a._callbacks.three.should.have.a.lengthOf(2)
        })
    })
    describe('.once(events, fn)', function () {
        it('Should only fire once', function () {
            var c = 0
            a.once('test', function () {c++})    
            a.publish('test')
            a.publish('test')
            c.should.equal(1)
            a._callbacks.test.should.have.a.lengthOf(0)
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