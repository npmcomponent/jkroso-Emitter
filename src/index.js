'use strict';

module.exports = Emitter

function Emitter (obj) {
    if ( !(this instanceof Emitter) ) return obj ? Emitter.mixin(obj) : new Emitter
}

var proto = Emitter.prototype

Emitter.new = function () {
    return new(this)
}

function resetCallbacks (obj) {
    // Should not be enumerable
    Object.defineProperty(obj, '_callbacks', {
        value : Object.create(null),
        writable : true,
        configurable : true
    })
}

Emitter.mixin = function (obj) {
    Object.keys(proto).forEach(function (key) {
        Object.defineProperty(obj, key, { 
            value: proto[key], 
            writable:true,
            configurable:true 
        })
    })
    return obj
}

proto.publish = function (topic, data) {
    var calls
    if ((calls = this._callbacks) && (calls = calls[topic])) {
        topic = calls.length
        while (topic--) {
            calls[topic].call(calls[--topic], data)
        }
    }
    return this
}

proto.on = function (topics, callback, context) {
    if (!this._callbacks) resetCallbacks(this)
    var calls = this._callbacks
    topics.split(/\s+/).forEach(function (topic) {
        // Push to the front of the array; Using concat to avoid mutating the old array
        calls[topic] = [context || this, callback].concat(calls[topic] || [])
    }, this)
    return this
}

proto.once = function (topics, callback, context) {
    topics.split(/\s+/).forEach(function (topic) {
        var self = this
        function on (data) {
            self.off(topic, on)
            callback.call(context, data)
        }
        this.on(topic, on, context)
    }, this)
    return this
}

proto.off = function (topics, callback) {
    var calls = this._callbacks
    if ( calls ) {
        if ( topics ) {
            if ( callback ) {
                topics.split(/\s+/).forEach(function (topic) {
                    var events = calls[topic]
                    if ( events ) {
                        events = events.slice()
                        var i = events.length
                        while (i--) {
                            if (events[i--] === callback) {
                                events.splice(i, 2)
                                calls[topic] = events
                                break
                            }
                        }
                    }                
                })
            } else {
                topics.split(/\s+/).forEach(function (topic) {
                    delete calls[topic]
                })
            }
        } else {
            resetCallbacks(this)
        }
    }
    return this
}