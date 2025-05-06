# EventEmitter Component

## EventEmitter.js

The `EventEmitter.js` file provides a simple event emitter class that allows for registering, emitting, and removing event listeners.

### Functions

- `constructor()`: Initializes a new EventEmitter instance.
- `on(eventName, listener)`: Registers a listener for a given event.
- `emit(eventName, ...args)`: Emits an event, calling all registered listeners for that event with the provided arguments.
- `off(eventName, listenerToRemove)`: Removes a specific listener for a given event.
- `once(eventName, listener)`: Registers a listener that will be called only once for a given event.

## EventEmitter.test.js

The `EventEmitter.test.js` file contains tests for the EventEmitter class. It uses the Jest testing framework to ensure the component behaves as expected.

### Tests

- **Event Emission**: Checks that a listener is called when its corresponding event is emitted.
- **Listener Removal**: Ensures that a listener is not called after it has been removed.
- **Multiple Listeners**: Verifies that multiple listeners for the same event are all called.
- **Once Listener**: Checks that a listener registered with `once` is only called a single time, even if the event is emitted multiple times.
- **Removing Non-existent Listener**: Ensures that attempting to remove a listener that was not registered does not cause an error.
- **Event Specificity**: Verifies that listeners for one event are not called when a different event is emitted.

## Sample Usage

Here is a sample usage demonstrating how to use the EventEmitter component:

```javascript
import { EventEmitter } from './EventEmitter.js';

// Create a new EventEmitter instance
const emitter = new EventEmitter();

// Define a listener function
function handleData(data) {
  console.log('Data received:', data);
}

// Register the listener for a 'data' event
emitter.on('data', handleData);

// Emit the 'data' event with some payload
emitter.emit('data', { message: 'Hello World' });
// Output: Data received: { message: 'Hello World' }

// Register a listener that will only be called once
emitter.once('oneTimeEvent', () => {
  console.log('This will only be logged once.');
});

emitter.emit('oneTimeEvent');
// Output: This will only be logged once.
emitter.emit('oneTimeEvent');
// No output, as the listener has been removed.

// Remove the 'handleData' listener
emitter.off('data', handleData);

// Emit the 'data' event again
emitter.emit('data', { message: 'This will not be logged.' });
// No output, as the listener has been removed.
```
