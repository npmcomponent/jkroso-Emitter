# Emitter

A simple but fairly convenient pub/sub implementation. Similar to backbone events

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
  - [proto.off()](#protoofftopicsstringcallbackfunction)

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

## proto.off([topics]:String, [callback]:Function)

  Remove subscriptions
  
```js
emitter.off() // clears all topics
emitter.off('topic') // clears all handlers under 'topic'
emitter.off('topic', fn) // removes fn from 'topic'
```

## Contributing
Throw down!

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Jakeb Rosoman  
Licensed under the MIT license.