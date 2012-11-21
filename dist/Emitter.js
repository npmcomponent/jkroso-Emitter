function require(p, context, parent){ context || (context = 0); var path = require.resolve(p, context), mod = require.modules[context][path]; if (!mod) throw new Error('failed to require "' + p + '" from ' + parent); if(mod.context) { context = mod.context; path = mod.main; mod = require.modules[context][mod.main]; if (!mod) throw new Error('failed to require "' + path + '" from ' + context); } if (!mod.exports) { mod.exports = {}; mod.call(mod.exports, mod, mod.exports, require.relative(path, context)); } return mod.exports;}require.modules = [{}];require.resolve = function(path, context){ var orig = path, reg = path + '.js', index = path + '/index.js'; return require.modules[context][reg] && reg || require.modules[context][index] && index || orig;};require.relative = function(relativeTo, context) { return function(p){ if ('.' != p.charAt(0)) return require(p, context, relativeTo); var path = relativeTo.split('/') , segs = p.split('/'); path.pop(); for (var i = 0; i < segs.length; i++) { var seg = segs[i]; if ('..' == seg) path.pop(); else if ('.' != seg) path.push(seg); } return require(path.join('/'), context, relativeTo); };};
require.modules[0] = { "src/index.js": function(module, exports, require){module.exports = Emitter

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
}}};