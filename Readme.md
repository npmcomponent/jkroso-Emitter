# Emitter

A simple event emitter.

## Features

- inherited subscriptions:  
This allows you to define subscriptions on the class rather than on each instance of a class which is both more efficient in terms of memery and sometimes cleaner too.

- each subscription can set its own context:  
This just means you don't have to `.bind()` functions as often which saves memory and often looks a little nicer. This feature is not present in the [light](light.js) implementation.

## Installation

_With [component](//github.com/component/component), [packin](//github.com/jkroso/packin) or [npm](//github.com/isaacs/npm)_  

    $ {package mananger} install jkroso/emitter

then in your app:

```javascript
var emitter = require('emitter')
```

## API

### Emitter()

  Generate a new Emitter or mixin methods to `obj`

```js
var emitter = new Emitter
var emitter = Emitter({})
```

### Emitter.emit(topic:String, [...]:Any)

  Generate an event. All arguments after `topic` will be passed to
  the handlers

```js
emitter.emit('event', new Date)
```

### Emitter.on(topic:String, fn:Function, context:Object)

  Add a subscription under a topic name

```js
emitter.on('event', function(data){})
emitter.on('event') // implies emitter.on('event', emitter.onEvent)
emitter.on('event', function(){this === emitter}, emitter)
emitter.on('event', function(){this === emitter}) // the current context is the default
```

### Emitter.off([topic]:String, [fn]:Function, [context]:Any)

  Remove subscriptions

```js
emitter.off() // clears all topics
emitter.off('topic') // clears all handlers from the topic 'topic'
emitter.off('topic', fn) // as above but only if the handler === fn
emitter.off('topic', fn, window) // as above but only if the context is `window`
```

### Emitter.hasSubscription(topic:String, [ƒ]:Function, [ctx]:Any)

  test if a subscription is present

## [License](License)

