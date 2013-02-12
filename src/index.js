module.exports = Emitter

/**
 * Generate an instance of Emitter
 *
 *   var emitter = new Emitter
 */

function Emitter () {this._callbacks = {}}

var proto = Emitter.prototype

/**
 * Generate an event
 *
 *   emitter.emit('event', new Date)
 *   
 * @param {String} topic the events topic
 * @param {Any} data to be passed to all handlers
 */

proto.emit = function (topic, data) {
	if (!(topic = this._callbacks[topic])) return
	var i = topic.length
	while (i--) topic[i].call(topic[--i], data)
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

/*!
 * Capitalize the first letter of a word
 */

function capitalize (word) {
	return word[0].toUpperCase() + word.slice(1)
}

/**
 * Add the subscription but insure its never called more than once
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
 *   emitter.off('topic') // clears all handlers from the topic 'topic'
 *   emitter.off('topic', fn) // as above but only if the handler === fn
 *   emitter.off('topic', fn, window) // as above but only if the context is `window`
 *
 * @param {String} [topic]
 * @param {Function} [callback]
 * @param {Any} [context]
 */

proto.off = function (topic, callback, context) {
	if (topic == null) {
		this._callbacks = {}
	} else {
		var calls = this._callbacks
		if (callback) {
			var events = calls[topic]
			if (!events) return
			var i = events.length
			while (i--) {
				if (events[i--] === callback) {
					if (context && events[i] !== context) continue
					events = events.slice()
					events.splice(i, 2)
					calls[topic] = events
				}
			}
		} else {
			delete calls[topic]
		}
	}
}