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
	Object.keys(proto).forEach(function (key) {
		Object.defineProperty(obj, key, {
			value: proto[key], 
			writable:true,
			configurable:true 
		})
	})
	return obj
}

/*!
 * Event seperator
 * 
 *   event | type
 *   event || type
 *   event|type
 */
var splitter = /\s*\|{1,2}\s*/

var proto = Emitter.prototype

/**
 * Generate an event
 *
 *   emitter.emit('event', new Date)
 *   
 * @param {String} topic the events topic
 * @param {Any} data to be passed to all handlers
 * @return {Self}
 */
proto.emit = 
proto.publish = function (topic, data) {
	var calls
	if ((calls = this._callbacks) && (calls = calls[topic])) {
		topic = calls.length
		while (topic--)
			calls[topic].call(calls[--topic], data)
	}
	return this
}

/**
 * Add a subscription under a topic name
 *
 *   emitter.on('event', function(data){})
 *   emitter.on('a | b', function(data){})
 *
 * @param {String} topics a pipe seperated string of event types
 * @param {Function} callback to be called when the topic is emitted
 * @param {Object} context to call the the function with
 * @return {Self}
 */
proto.on = function (topics, callback, context) {
	topics = topics.split(splitter)
	var calls = this._callbacks || (this._callbacks = {}),
		i = topics.length

	while (i--)
		// Push to the front of the array; Using concat to avoid mutating the old array
		calls[topics[i]] = [context || this, callback].concat(calls[topics[i]] || [])

	return this
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
 *
 * @param {String} [topics] a list of topics seperated by pipes
 * @param {Function} [callback] the function to remove
 * @return {Self} [description]
 */
proto.off = function (topics, callback) {
	var calls = this._callbacks
	if (!calls) return this
	if (topics != null) {
		topics = topics.split(splitter)
		var len = topics.length
		if (callback)
			while (len--) {
				var events = calls[topics[len]]
				if (!events) return
				var i = events.length
				while (i--)
					if (events[i--] === callback) {
						events = events.slice()
						events.splice(i, 2)
						calls[topics[len]] = events
						break
					}
			}
		else
			while (len--) delete calls[topics[len]]
	} 
	else
		this._callbacks = {}
	return this
}