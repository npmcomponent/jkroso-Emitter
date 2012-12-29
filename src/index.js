module.exports = Emitter

/**
 * Generate an instance of Emitter
 *
 *   var emitter = new Emitter
 */
function Emitter () {this._callbacks = {}}

/**
 * An alternative constructor syntax
 */
Emitter.new = function () {
	return new(this)
}

/**
 * Add emitter behavior to any object
 * 
 * @param {Object} obj to recieve Emitter methods
 * @return {obj} that you passed in
 */
Emitter.mixin = function (obj) {
	Emitter.call(obj)
	for (var key in proto)
		obj[key] = proto[key]
	return obj
}

var proto = Emitter.prototype

/**
 * Generate an event
 *
 *   emitter.emit('event', new Date)
 *   
 * @param {String} topic the events topic
 * @param {Any} data to be passed to all handlers
 */
proto.emit = 
proto.publish = function (topic, data) {
	var calls = this._callbacks[topic]
	if (!calls) return
	topic = calls.length
	while (topic--)
		calls[topic].call(calls[--topic], data)
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
 * @param {Function} callback to be called when the topic is emitted
 * @param {Object} context to call the the function with
 * @return {callback} whatever function was subscribed
 */
proto.on = function (topic, callback, context) {
	var calls = this._callbacks
	if (callback == null) {
		callback = this['on'+capitalize(topic)]
		if (!callback) throw new Error('Could not find a method for '+topic)
	}
	// Push to the front of the array; Using concat to avoid mutating the old array
	calls[topic] = [context || this, callback].concat(calls[topic] || [])

	return callback
}

/**
 * Capitalize the first letter of a word
 */
function capitalize (word) {
	return word[0].toUpperCase() + word.slice(1)
}

/**
 * Add the subscription but insure it never called more than once
 * @see Emitter#on
 */
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

/**
 * Remove subscriptions
 *
 *   emitter.off() // clears all topics
 *   emitter.off('topic') // clears all handlers under 'topic'
 *   emitter.off('topic', fn) // removes fn from 'topic'
 *   emitter.off('topic', fn, window) // removes fn from 'topic' with context of `window`
 *
 * @param {String} [topic] filter by === topic
 * @param {Function} [callback] filter by === callback
 * @param {Any} [context] filter by === context
 */
proto.off = function (topic, callback, context) {
	if (topic == null)
		this._callbacks = {}
	else {
		var calls = this._callbacks
		if (callback) {
			var events = calls[topic]
			if (!events) return
			var i = events.length
			while (i--)
				if (events[i--] === callback) {
					if (context && events[i] !== context) continue
					events = events.slice()
					events.splice(i, 2)
					calls[topic] = events
				}
		}
		else
			delete calls[topic]
	}
}