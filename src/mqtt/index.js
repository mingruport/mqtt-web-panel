const mqtt = require('./handler');
const { allWidgets } = require('../widgets');
const config = require('../config');

const connectAndSubscribe = () => {
  return allWidgets()
    .then(widgets => {
      const topics = mapTopics(widgets);

      mqtt(config.mqttOptions, topics);
    });
};

const mapTopics = widgets => {
  return widgets.reduce((topics, widget) => ({...topics, [widget.topic]: { qos: widget.qos } }), {})
}

module.exports = {
  connectAndSubscribe,
}