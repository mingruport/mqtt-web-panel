const express = require('express');
const topicsController = require('./../controllers/topics');

const router = express.Router();

/** GET api/topics - Get list of topics */
router.get('/', topicsController.getTopics);

/** GET api/topics/friendlyId - Get topic */
router.get('/:friendlyId', topicsController.getTopic);

/** POST api/topics - Create new sensor */
router.post('/', topicsController.addTopic);

/** PUT api/topics/:friendlyId - Update topic */
router.put('/:friendlyId', topicsController.updateTopic);

/** DELETE api/topics/:friendlyId - Delete topic */
router.delete('/:friendlyId', topicsController.deleteTopic);

module.exports = router;
