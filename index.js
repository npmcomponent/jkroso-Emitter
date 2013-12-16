
var merge = require('merge')
var own = Object.hasOwnProperty
var call = Function.call

module.exports = Emitter

/**
 * Emitter constructor. Can optionally also act as a mixin
 *
 * @param {Object} [obj]
 * @return {Object}
 */

function Emitter(obj){
	if (obj) return merge(obj, Emitter.prototype)
}

/**
 * Process `event`. All arguments after `topic` will
 * be passed to all listeners
 *
 *   emitter.emit('event', new Date)
 *
 * @param {String} topic
 * @param {Any} [...args]
 * @return {this}
 */

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

/**
 * Add a subscription under a topic name
 *
 *   emitter.on('event', function(data){})
 *
 * @param {String} topic
 * @param {Function} fn
 * @return {this}
 */

Emitter.prototype.on = function(topic, fn){
	if (!own.call(this, '_events')) this._events = clone(this._events)
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

/**
 * Remove subscriptions
 *
 *   emitter.off()            // clears all listeners
 *   emitter.off('topic')     // clears all `topic` listeners
 *   emitter.off('topic', fn) // as above but only where `listener == fn`
 *
 * @param {String} [topic]
 * @param {Function} [fn]
 * @return {this}
 */

Emitter.prototype.off = function(topic, fn){
	if (!this._events) return this
	if (!own.call(this, '_events')) this._events = clone(this._events)
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
			subs = events[topic] = subs.filter(function(listener){
				return listener !== fn
			})
			// tidy
			if (subs.length == 1) events[topic] = subs[0]
			else if (!subs.length) delete events[topic]
		}
	}
	return this
}

/**
 * subscribe `fn` but remove if after its first invocation
 *
 * @param {String} topic
 * @param {Function} fn
 * @return {this}
 */

Emitter.prototype.once = function(topic, fn){
	var self = this
	return this.on(topic, function once(){
		self.off(topic, once)
		fn.apply(this, arguments)
	})
}

/**
 * see if `emitter` has any subscriptions matching
 * `topic` and optionally also `fn`
 *
 * @param {Emitter} emitter
 * @param {String} topic
 * @param {Function} [fn]
 * @return {Boolean}
 */

Emitter.hasSubscription = function(emitter, topic, fn){
	var fns = Emitter.subscriptions(emitter, topic)
	if (fn == null) return Boolean(fns.length)
	return fns.indexOf(fn) >= 0
}

/**
 * get an Array of subscriptions for `topic`
 *
 * @param {Emitter} emitter
 * @param {String} topic
 * @return {Array}
 */

Emitter.subscriptions = function(emitter, topic){
	var fns = emitter._events
	if (!fns || !(fns = fns[topic])) return []
	if (typeof fns == 'function') return [fns]
	return fns.slice()
}

function clone(obj){
	return merge({}, obj)
}
