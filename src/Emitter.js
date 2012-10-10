define(function () { 'use strict';
    
    function Emitter (obj) {
        if ( obj ) {
            Object.keys(Emitter.prototype).forEach(function (key) {
                if ( ! obj.hasOwnProperty(key) ) {
                    Object.defineProperty(obj, key, { 
                        value: Emitter.prototype[key], 
                        writable:true,
                        configurable:true 
                    })
                }
            })
            return Emitter.call(obj)
        }
        // Using discriptor to prevent non-subTopic properties from being enumerable
        Object.defineProperties(this, {
            _callbacks : {
                value : {},
                writable : true
            }
        })
    }

    Emitter.prototype = {
        publish : function (topic, data) {
            var calls
            if ( calls = this._callbacks ) {
                calls = calls[topic]
                if (calls) {
                    var i = calls.length
                    while (i--) {
                        calls[i].call(calls[--i], data)
                    }
                }
            }
            return this
        },
        on : function (topics, callback, context) {
            var calls = this._callbacks || (this._callbacks = {})
            topics.split(/\s+/).forEach(function (topic) {
                calls[topic] = [context || this, callback].concat(calls[topic] || [])
            }, this)
            return this
        },
        once : function (topics, callback, context) {
            topics.split(/\s+/).forEach(function (topic) {
                var self = this
                function on (data) {
                    self.off(topic, on)
                    callback.call(context, data)
                }
                this.on(topic, callback, context)
            })
            return this
        },
        off : function (topics, callback) {
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
                    this._callbacks = {}
                }
            }
            return this
        }
    }

    Object.defineProperty(Emitter.prototype, 'constructor', { value: Emitter })

    return Emitter
})