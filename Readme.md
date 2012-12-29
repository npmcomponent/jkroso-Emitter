# Emitter

A simple event emitter. I implemented my own so I could optimise for performance and implement new features as I require. The main advantage of this implementation is its handling of context. It allows you to specify a context when you create a subscription (a la backbone.js) but also takes this into account when unsubscribing. So when unsubscribing you have three levels of specificity available to you. topic(s), topic(s)+callback, and topic(s)+callback+context. This makes it possible to work with methods defined on an objects prototype without wrapping them since you now have a way of differentiating between subscriptions belonging to different instances.

## Getting Started

With component

	$ component install jkroso/emitter

with the latest npm

	$ npm install jkroso/emitter

## API
  - [Emitter()](#emitter)
  - [Emitter.new()](#emitternew)
  - [Emitter.mixin()](#emittermixinobjobject)
  - [proto.emit](#protoemit)
  - [proto.on()](#protoontopicstringcallbackfunctioncontextobject)
  - [capitalize()](#capitalize)
  - [proto.once()](#protoonce)
  - [proto.off()](#protoofftopicstringcallbackfunctioncontextany)

## Emitter()

  Generate an instance of Emitter
  
```js
var emitter = new Emitter
```

## Emitter.new()

  An alternative constructor syntax

## Emitter.mixin(obj:Object)

  Add emitter behavior to any object

## proto.emit

  Generate an event
  
```js
emitter.emit('event', new Date)
```

## proto.on(topic:String, callback:Function, context:Object)

  Add a subscription under a topic name
  
```js
emitter.on('event', function(data){})
emitter.on('event') // implies emitter.on('event', emitter.onEvent)
emitter.on('event', function(){this === emitter}, emitter)
emitter.on('event', function(){this === emitter}) // the current context is the default
```

## capitalize()

  Capitalize the first letter of a word

## proto.once()

  Add the subscription but insure it never called more than once

## proto.off([topic]:String, [callback]:Function, [context]:Any)

  Remove subscriptions
  
```js
emitter.off() // clears all topics
emitter.off('topic') // clears all handlers under 'topic'
emitter.off('topic', fn) // removes fn from 'topic'
emitter.off('topic', fn, window) // removes fn from 'topic' with context of `window`
```

## Contributing
Throw down!

## Release History

v0.5.0 29/12/2012
- no longer using a chainable api
- .on() no longer takes multiple topics
- can default methods

## License
Copyright (c) 2012 Jakeb Rosoman  
Licensed under the MIT license.