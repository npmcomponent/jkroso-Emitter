(function(){function require(e,t){for(var n=[],r=e.split("/"),i,s,o=0;s=r[o++];)".."==s?n.pop():"."!=s&&n.push(s);n=n.join("/"),o=require,s=o.m[t||0],i=s[n+".js"]||s[n+"/index.js"]||s[n];if(s=i.c)i=o.m[t=s][e=i.m];return i.exports||i(i,i.exports={},function(n){return o("."!=n.charAt(0)?n:e+"/../"+n,t)}),i.exports};
require.m = [];
require.m[0] = { "src/index.js": function(module, exports, require){'use strict';

module.exports = Emitter

function Emitter () {this._callbacks = {}}

var proto = Emitter.prototype

Emitter.new = function () {
    return new(this)
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

proto.emit = proto.publish = function (topic, data) {
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
    topics = topics.split(/\s+/)
    var calls = this._callbacks || (this._callbacks = {}),
        i = topics.length

    while (i--)
        // Push to the front of the array; Using concat to avoid mutating the old array
        calls[topics[i]] = [context || this, callback].concat(calls[topics[i]] || [])

    return this
}

proto.once = function (topics, callback, context) {
    var self = this
    return this.on(
        topics, 
        function on (data) {
            self.off(topics, on)
            return callback.call(context, data)
        }, 
        context
    )
}

proto.off = function (topics, callback) {
    var calls
    if ( calls = this._callbacks ) {
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
            } 
            else {
                topics.split(/\s+/).forEach(function (topic) {
                    delete calls[topic]
                })
            }
        } 
        else {
            this._callbacks = {}
        }
    }
    return this
}}};
Emitter = require('src/index.js');
}());