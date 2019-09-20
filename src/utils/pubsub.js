const { EventEmitter } = require('events');

class PubSub extends EventEmitter {
  /**
  * Subscribes to the event.
  * @param {String} event The name of the event.
  * @param {Function} listener The callback function.
  * @return {Function}
  */
  subscribe(event, listener) {
    this.on(event, listener);
    return listener;
  }

  /**
  * Removes the subscribe.
  * @param {String} event The name of the event.
  * @param {Function} listener The listener of this event.
  */
  unsubscribe(event, listener) {
    this.removeListener(event, listener);
  }

  /**
  * Publishes the event.
  * @param {String} event The name of the event.
  * @param {Object} payload The payload of the event.
  */
  publish(event, payload) {
    this.emit(event, payload);
  }
}

module.exports = new PubSub;