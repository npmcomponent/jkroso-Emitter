/**
 * A highly optimised emitter implementation. Optimised to 
 * minimize both memory and CPU consumption. Its good for 
 * implementing simple but hot things like streams. 
 */

var call = Function.prototype.call

module.exports = Emitter

/**
 * Generate a new Emitter or mixin methods to `obj`
 *
 *   var emitter = new Emitter
 *   var emitter = Emitter({})
 */

function Emitter (obj) {
	if (obj) {
		for (var prop in proto) {
			obj[prop] = proto[prop]
		}
		return obj
	}
}

var proto = Emitter.prototype

/**
 * Generate an event. All arguments after `topic` will be passed to
 * the handlers
 *
 *   emitter.emit('event', new Date)
 *   
 * @param {String} topic the events topic
 * @param {Any} [...]
 */

Emitter.prototype.emit = function (topic) {
	var sub = this._events
	if (!(sub && (sub = sub[topic]))) return
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
		var i = 0
		var ƒ
		switch (arguments.length) {
			case 1: while (ƒ = sub[i++]) ƒ.call(this);break
			case 2: while (ƒ = sub[i++]) ƒ.call(this, arguments[1]);break
			case 3: while (ƒ = sub[i++]) ƒ.call(this, arguments[1], arguments[2]);break
			case 4: while (ƒ = sub[i++]) ƒ.call(this, arguments[1], arguments[2], arguments[3]);break
			default:
				topic = this
				while (ƒ = sub[i++]) call.apply(ƒ, arguments)
		}
	}
}

/**
 * subscribe `fn` to `topic`
 *
 *   emitter.on('event', function(data){})
 *
 * @param {String} topic
 * @param {Function} fn
 * @return {fn}
 */

Emitter.prototype.on = function (topic, fn) {
	var events = this._events || (this._events = {})
	var subs = events[topic] 
	if (!subs) events[topic] = fn
	else if (typeof subs == 'function') {
		events[topic] = [events[topic], fn]
	} else {
		events[topic] = subs.concat(fn)
	}
	return fn
}

/**
 * Remove subscriptions
 *
 *   emitter.off() // clears all topics
 *   emitter.off('topic') // clears all handlers from the topic 'topic'
 *   emitter.off('topic', fn) // as above but only if the handler === fn
 *
 * @param {String} [topic]
 * @param {Function} [fn]
 */

Emitter.prototype.off = function (topic, fn) {
	var events = this._events
	if (!events) return

	// no filters
	if (topic == null) {
		for (var i in events) delete events[i]
	} 
	// just a topic
	else if (!fn) {
		delete events[topic]
	}
	else {
		var subs = events[topic]
		if (!subs) return
		if (typeof subs == 'function') {
			if (subs === fn) delete events[topic]
		} else {
			subs = events[topic] = subs.filter(function(ƒ){
				return ƒ !== fn
			})
			// tidy
			if (subs.length == 1) events[topic] = subs[0]
			else if (!subs.length) delete events[topic]
		}
	}
}

Emitter.prototype.once = function (topic, fn) {
	if (!fn) return
	var self = this
	this.on(topic, function once() {
		fn.apply(this, arguments)
		self.off(topic, once)
	})
}
