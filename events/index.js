const { EventEmitter } = require('events');

class Stream extends EventEmitter {
  push(event, ...payload) {
    this.emit(event, ...payload);
  }

  subscribe(event, callback) {
    this.on(event, callback);
    return this;
  }
}

module.exports = new Stream;
