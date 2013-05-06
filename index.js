
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
	var cbs = this._callbacks
	if (!(cbs && (cbs = cbs[topic]))) return
	var i = cbs.length
	// try avoid using apply for speed
	switch (arguments.length) {
		case 1: while (i) cbs[--i].call(cbs[--i]);break
		case 2: while (i) cbs[--i].call(cbs[--i], arguments[1]);break
		case 3: while (i) cbs[--i].call(cbs[--i], arguments[1], arguments[2]);break
		case 4: while (i) cbs[--i].call(cbs[--i], arguments[1], arguments[2], arguments[3]);break
		default:while (i) {
			var ƒ = cbs[--i]
			topic = cbs[--i]
			call.apply(ƒ, arguments)
		}
	}
}

/**
 * Add a subscription under a topic name
 *
 *   emitter.on('event', function(data){})
 *   emitter.on('event') // implies emitter.on('event', emitter.onEvent)
 *   emitter.on('event', function(){this === emitter}, emitter)
 *   emitter.on('event', function(){this === emitter}) // the current context is the default
 *
 * @param {String} topic
 * @param {Function} fn to be called when the topic is emitted
 * @param {Object} context to call the the function with
 * @return {fn}
 */

Emitter.prototype.on = function (topic, fn, context) {
	var cbs = this._callbacks || (this._callbacks = {})
	// avoid mutating the old array
	cbs[topic] = cbs[topic]
		? [context || this, fn].concat(cbs[topic])
		: [context || this, fn]

	return fn
}

/**
 * Remove subscriptions
 *
 *   emitter.off() // clears all topics
 *   emitter.off('topic') // clears all handlers from the topic 'topic'
 *   emitter.off('topic', fn) // as above but only if the handler === fn
 *   emitter.off('topic', fn, window) // as above but only if the context is `window`
 *
 * @param {String} [topic]
 * @param {Function} [fn]
 * @param {Any} [context]
 */

Emitter.prototype.off = function (topic, fn, context) {
	var cbs = this._callbacks
	if (!cbs) return

	// no filters
	if (topic == null) {
		for (var i in cbs) delete cbs[i]
	} 
	// just a topic
	else if (!fn) {
		delete cbs[topic]
	} 
	else {
		var events = cbs[topic]
		if (!events) return
		var i = events.length
		while (i--) {
			if (events[i--] !== fn) continue
			// if `context`, then it needs to match too
			if (context && events[i] !== context) continue
			events = events.slice()
			events.splice(i, 2)
			cbs[topic] = events
		}
	}
}

Emitter.prototype.once = function (topic, fn, context) {
	if (!fn) return
	var self = this
	this.on(topic, function once() {
		fn.apply(this, arguments)
		self.off(topic, once)
	}, context)
}
