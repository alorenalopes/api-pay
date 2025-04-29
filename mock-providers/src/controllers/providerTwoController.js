const providerTwoService = require('../services/providerTwoService');
const ValidationSchemas = require('../validations/validationSchemas');
const {STATUS} = require('../constants/statusConstants');

/**
 * Process a new payment transaction
 */
const processTransaction = (req, res) => {
    const validation = ValidationSchemas.validate(ValidationSchemas.transaction, req.body);

    if (!validation.isValid) {
        return res.status(400).json({
            status: STATUS.ERROR,
            message: validation.error
        });
    }

    const transaction = providerTwoService.createTransaction(req.body);

    if (transaction.status === STATUS.FAILED) {
        return res.status(500).json(transaction);
    }

    return res.status(201).json(transaction);
};

/**
 * Retrieve the details of an existing transaction
 */
const getTransactionDetails = (req, res) => {
    const {id} = req.params;

    if (!ValidationSchemas.validate(ValidationSchemas.idParam, req.params).isValid) {
        return res.status(400).json({
            status: STATUS.ERROR,
            message: 'Transaction ID is required'
        });
    }

    const transaction = providerTwoService.getTransactionById(id);

    if (!transaction) {
        return res.status(404).json({
            status: STATUS.ERROR,
            message: 'Transaction not found'
        });
    }

    return res.json(transaction);
};

/**
 * Process the void of a transaction (refund)
 */
const processRefund = (req, res) => {
    const {id} = req.params;

    const validation = ValidationSchemas.validate(ValidationSchemas.idParam, req.params);

    if (!validation.isValid) {
        return res.status(400).json({
            status: STATUS.ERROR,
            message: validation.error
        });
    }

    const {amount} = req.body || {};

    const updatedTransaction = providerTwoService.voidTransaction(id, amount);

    if (!updatedTransaction) {
        return res.status(404).json({
            status: STATUS.ERROR,
            message: 'Transaction not found'
        });
    }

    return res.json(updatedTransaction);
};

module.exports = {
    processTransaction,
    getTransactionDetails,
    processRefund
};