# Emitter

A simple event emitter. I implemented my own so I could optimise for performance and implement new features as I require. The main advantage of this implementation is its handling of context. It allows you to specify a context when you create a subscription a la backbone.js but also takes this into account when unsubscribing. So when unsubscribing you have three levels of specificity available to you. topic, topic+callback, and topic+callback+context. This makes it possible to work with methods defined on an objects prototype without wrapping them since you now have a way of differentiating between subscriptions belonging to different instances.

Example:
```js
function O (name) {this.name = name}
O.prototype.onResize = function(){
  console.log('Hi im an O by the name '+this.name)
}

var a = new O('olivia')
var b = new O('obby')

viewport.on('resize', a.onResize, a)
viewport.on('resize', b.onResize, b)
viewport.emit('resize') 
// => Hi im an O by the name olivia
// => Hi im an O by the name obby

viewport.off('resize', a.onResize, a)

viewport.emit('resize') 
// => Hi im an O by the name obby
```

## Getting Started

With component

	$ component install jkroso/emitter

with the latest npm

	$ npm install jkroso/emitter

## API
  - [Emitter()](#emitter)
  - [Emitter.new()](#emitternew)
  - [Emitter.mixin()](#emittermixinobjobject)
  - [Emitter.emit()](#emitteremittopicstringdataany)
  - [Emitter.on()](#emitterontopicstringcallbackfunctioncontextobject)
  - [Emitter.once()](#emitteronce)
  - [Emitter.off()](#emitterofftopicstringcallbackfunctioncontextany)

## Emitter()

  Generate an instance of Emitter
  
```js
var emitter = new Emitter
```

## Emitter.new()

  An alternative constructor syntax

## Emitter.mixin(obj:Object)

  Add emitter behavior to any object

## Emitter.emit(topic:String, data:Any)

  Generate an event
  
```js
emitter.emit('event', new Date)
```

## Emitter.on(topic:String, callback:Function, context:Object)

  Add a subscription under a topic name
  
```js
emitter.on('event', function(data){})
emitter.on('event') // implies emitter.on('event', emitter.onEvent)
emitter.on('event', function(){this === emitter}, emitter)
emitter.on('event', function(){this === emitter}) // the current context is the default
```

## Emitter.once()

  Add the subscription but insure it never called more than once

## Emitter.off([topic]:String, [callback]:Function, [context]:Any)

  Remove subscriptions
  
```js
emitter.off() // clears all topics
emitter.off('topic') // clears all handlers from the topic 'topic'
emitter.off('topic', fn) // as above but only if the handler === fn
emitter.off('topic', fn, window) // as above but only if the context is `window`
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

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
