# Emitter

A simple event emitter. I implemented my own so I could optimise for performance and implement new features as I require. The main advantage of this implementation is its handling of context. It allows you to specify a context when you create a subscription (a la backbone.js) but also takes this into account when unsubscribing. So when unsubscribing you have three levels of specificity available to you. topic(s), topic(s)+callback, and topic(s)+callback+context. This makes it possible to work with methods defined on an objects prototype without wrapping them since you now have a way of differentiating between subscriptions belonging to different instances.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/jkroso/Emitter/master/dist/Emitter.min.js
[max]: https://raw.github.com/jkroso/Emitter/master/dist/Emitter.js

With component

	$ component install jkroso/emitter

with npm

	$ npm install jkroso/emitter

## API
  - [Emitter()](#emitter)
  - [Emitter.new()](#emitternew)
  - [Emitter.mixin()](#emittermixinobjobject)
  - [proto.emit](#protoemit)
  - [proto.on()](#protoontopicsstringcallbackfunctioncontextobject)
  - [proto.once()](#protoonce)
  - [proto.off()](#protoofftopicsstringcallbackfunctioncontextany)

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

## proto.on(topics:String, callback:Function, context:Object)

  Add a subscription under a topic name
  
```js
emitter.on('event', function(data){})
emitter.on('a | b', function(data){})
```

## proto.once()

  Add the subscription but insure it never called more than once

## proto.off([topics]:String, [callback]:Function, [context]:Any)

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
_(Nothing yet)_

## License
Copyright (c) 2012 Jakeb Rosoman  
Licensed under the MIT license.