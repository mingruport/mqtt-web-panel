const express = require('express');
const {
  allWidgets,
  getWidgetById,
  allEventByWidget,
  createWidget,
  updateWidget,
  deleteWidget
} = require('../widgets');

const router = express.Router();

/** GET api/widgets - Get all widgets */
router.get('/', (req, res, next) => {
  allWidgets()
    .then(widgets => res.json({ widgets }))
    .catch(err => next(err));
});

/** GET api/widgets/:id - Get a single widget */
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  getWidgetById(id)
    .then(widget => res.json(widget))
    .catch(err => next(err));
});

/** GET api/widget/:id/events - Get widget events */
router.get('/:id/events', (req, res, next) => {
  const id = req.params.id;
  const period = req.query.period;

  getWidgetById(id)
    .then(widget => allEventByWidget(widget._id, period))
    .then(data => res.json(data))
    .catch(err => next(err));
});

/** POST api/widgets - Create a new widget */
router.post('/', (req, res, next) => {
  const { name, topic, unit } = req.body;

  createWidget({ name, topic, unit })
    .then(widget => res.status(201).json(widget))
    .catch(err => next(err));
});

/** PUT api/widgets/:id - Update widget */
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  getWidgetById(id)
    .then(widget => updateWidget(widget, body))
    .then(widget => res.json(widget))
    .catch(err => next(err));
});

/** DELETE api/widgets/:id - Delete widget */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  getWidgetById(id)
    .then(widget => deleteWidget(widget))
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
});

module.exports = router;
