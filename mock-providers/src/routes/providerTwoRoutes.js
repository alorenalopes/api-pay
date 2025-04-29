const express = require('express');
const router = express.Router();
const providerTwoController = require('../controllers/providerTwoController');

/** Process a new payment transaction */
router.post('/transactions', providerTwoController.processTransaction);

/** Get details of a specific transaction */
router.get('/transactions/:id', providerTwoController.getTransactionDetails);

/** Process a void/refund for a transaction */
router.post('/void/:id', providerTwoController.processRefund);

module.exports = router;