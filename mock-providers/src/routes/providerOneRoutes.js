const express = require('express');
const router = express.Router();
const providerOneController = require('../controllers/providerOneController');

/** Process a new payment charge */
router.post('/charges', providerOneController.processCharge);

/** Get details of a specific charge */
router.get('/charges/:id', providerOneController.getChargeDetails);

/** Process a refund for a charge */
router.post('/refund/:id', providerOneController.processRefund);

module.exports = router;