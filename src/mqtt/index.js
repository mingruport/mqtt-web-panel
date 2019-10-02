const mqtt = require('../mqtt/handler');
const { allWidgets } = require('../widgets');
const config = require('../config');

const connectAndSubscribe = () => {
  return allWidgets()
    .then(widgets => {
      const topics = widgets.map(widget => ({ [widget.topic]: { qos: widget.qos } }));
      mqtt(config.mqttOptions, topics);
    });
};

module.exports = {
  connectAndSubscribe,
}