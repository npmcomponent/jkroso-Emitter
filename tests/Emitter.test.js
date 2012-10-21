define([
    '../src/Emitter',
    'chai'
], function (Emitter, chai) {
    
    describe('Emitter', function () {
        var a
        beforeEach(function () {
            a = new Emitter
        })
        describe('Instantiate', function () {
            it('Should not throw any errors', function () {
                new Emitter
            })
            it('Should have no enumerable properties', function () {
                Object.keys(new Emitter).length.should.be.equal(0)
            })
        })
        describe('.on(events, fn, context)', function () {
            it('Should extent the _callbacks property', function () {
                function fn () {
                    this.should.be.equal(a)
                }
                a.on('test', fn, a)
                Object.keys(a._callbacks).length.should.be.equal(1)
                a._callbacks.test.should.be.an('Array')
                a._callbacks.test[0].should.be.equal(a)
                a._callbacks.test[1].should.be.equal(fn)
            })
            it('Should be able to subscribe multiple functions per event', function (done) {
                var c = 0
                function fn () {
                    c.should.be.equal(1)
                    this.should.be.equal(a)
                    done()
                }
                a.on('test', function () {
                    this.should.be.equal(a)
                    ;(c++).should.be.equal(0)
                }, a)
                a.on('test', fn, a)
                a._callbacks.test.length.should.be.equal(4)
                a.publish('test')
            })
            it('Should default the context to the current this value', function (done) {
                a.on('test', function () {
                    this.should.be.equal(a)
                    done()
                })
                a._callbacks.test[0].should.be.equal(a)
                a._callbacks.test.length.should.be.equal(2)
                a.publish('test')
            })
        })
        describe('.publish(event, data)', function () {
            it('Should fire in the order functions were subscribed')
            it('Should call functions with their specified context')
        })
        describe('.off(events, fn)', function () {
            it('Should remove only the specied fn and its context', function () {
                function fn () {}
                a.on('test', fn, a)
                a.on('test', function a () {}, fn)
                a.off('test', fn)
                a._callbacks.test[0].should.be.equal(fn)
                a._callbacks.test[1].name.should.be.equal('a')
            })
            it('Should remove all events if no `events` is passed', function () {
                a.on('rad', function () {})
                a.on('test', function () {})
                a.off()
                Object.keys(a._callbacks).length.should.be.equal(0)
            })
            it('Should clear all events if no `fn` is passed', function () {
                a.on('test', function () {})
                a.on('test', function () {})
                a.off('test')
                chai.should().not.exist(a._callbacks.test)
            })
        })
    })
})