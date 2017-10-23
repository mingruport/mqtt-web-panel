const express = require('express');
const timeseriesController = require('../controllers/timeseries.controller');

const router = express.Router();

/** GET api/timeseries - Get statistics data */
router.get('/', timeseriesController.getTimeseriesData);

module.exports = router;
