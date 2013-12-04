
/**
 * A highly optimised emitter implementation. Optimised to
 * minimize both memory and CPU consumption. Its good for
 * implementing simple but hot things like streams.
 */

var merge = require('merge')
var own = {}.hasOwnProperty
var call = Function.call

module.exports = Emitter

function Emitter(obj){
	if (obj) return merge(obj, Emitter.prototype)
}

Emitter.prototype.emit = function(topic){
	var sub = this._events
	if (!(sub && (sub = sub[topic]))) return this
	// single subsription case
	if (typeof sub == 'function') {
		// avoid using .apply() for speed
		switch (arguments.length) {
			case 1: sub.call(this);break
			case 2: sub.call(this, arguments[1]);break
			case 3: sub.call(this, arguments[1], arguments[2]);break
			case 4: sub.call(this, arguments[1], arguments[2], arguments[3]);break
			default:
				// `arguments` is magic :)
				topic = this
				call.apply(sub, arguments)
		}
	} else {
		var fn
		var i = 0
		var l = sub.length
		switch (arguments.length) {
			case 1: while (i < l) sub[i++].call(this);break
			case 2: while (i < l) sub[i++].call(this, arguments[1]);break
			case 3: while (i < l) sub[i++].call(this, arguments[1], arguments[2]);break
			case 4: while (i < l) sub[i++].call(this, arguments[1], arguments[2], arguments[3]);break
			default:
				topic = this
				while (i < l) call.apply(sub[i++], arguments)
		}
	}
	return this
}

Emitter.prototype.on = function(topic, fn){
	if (!own.call(this, '_events')) {
		this._events = clone(this._events)
	}
	var events = this._events
	if (typeof events[topic] == 'function') {
		events[topic] = [events[topic], fn]
	} else if (events[topic]) {
		events[topic] = events[topic].concat(fn)
	} else {
		events[topic] = fn
	}
	return this
}

Emitter.prototype.off = function(topic, fn){
	if (!this._events) return this
	if (!own.call(this, '_events')) {
		this._events = clone(this._events)
	}
	var events = this._events

	if (topic == null) {
		for (var i in events) delete events[i]
	} else if (fn == null) {
		delete events[topic]
	} else {
		var subs = events[topic]
		if (!subs) return this
		if (typeof subs == 'function') {
			if (subs === fn) delete events[topic]
		} else {
			subs = events[topic] = subs.filter(function(fn){
				return fn !== fn
			})
			// tidy
			if (subs.length == 1) events[topic] = subs[0]
			else if (!subs.length) delete events[topic]
		}
	}
	return this
}

Emitter.prototype.once = function(topic, fn){
	var self = this
	return this.on(topic, function once() {
		self.off(topic, once)
		fn.apply(this, arguments)
	})
}

Emitter.hasSubscription = function(emitter, topic, fn){
	var fns = Emitter.subscriptions(emitter, topic)
	if (fn == null) return Boolean(fns.length)
	return fns.indexOf(fn) >= 0
}

Emitter.subscriptions = function(emitter, topic){
	var fns = emitter._events
	if (!fns || !(fns = fns[topic])) return []
	if (typeof fns == 'function') return [fns]
	return fns.slice()
}

function clone(obj){
	return merge({}, obj)
}