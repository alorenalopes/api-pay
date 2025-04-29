const Constants = require('../constants/paymentConstants');
const paymentProviderFactory = require('../services/providers/paymentProviderFactory');
const paymentStoreService = require('../services/paymentStoreService');
const validator = require('../validations/validationSchemas');
const responseHandlers = require('../utils/responseHandlers');

/**
 * Controller responsible for handling payment operations
 * @class PaymentController
 */
class PaymentController {
    /**
     * Validates request data according to specified validation type
     * @param {Object} res - Express response object
     * @param {Object|null} data - Request data to validate
     * @param {string} validationType - Type of validation ('payment', 'id', or 'refund')
     * @param {string|null} [param] - Optional parameter used for ID validation
     * @returns {boolean} - Returns true if validation passes, false otherwise
     */
    validateRequest(res, data, validationType, param = null) {
        let validationResult;

        if (validationType === 'payment') {
            validationResult = validator.validatePayment(data);
        } else if (validationType === 'id') {
            validationResult = validator.validateId(param || data);
        } else if (validationType === 'refund') {
            validationResult = validator.validateRefund(data);
        }

        if (validationResult.error) {
            responseHandlers.handleValidationError(res, validationResult.error);
            return false;
        }
        return true;
    }

    /**
     * Retrieves payment record by ID or returns error response
     * @param {string} id - Payment record ID
     * @param {Object} res - Express response object
     * @returns {Promise<Object|null>} - Payment record or null if not found
     */
    async getPaymentRecordOrFail(id, res) {
        const paymentRecord = paymentStoreService.getPaymentRecord(id);
        if (!paymentRecord) {
            res.status(404).json({message: 'Payment record not found in database'});
            return null;
        }
        return paymentRecord;
    }

    /**
     * Processes a new payment request with failover capability
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} - JSON response with payment result
     */
    async processPayment(req, res) {
        try {
            const paymentData = req.body;

            if (!this.validateRequest(res, paymentData, 'payment')) {
                return;
            }

            try {
                const primaryProvider = paymentProviderFactory.getPrimaryProvider();
                const result = await primaryProvider.processPayment(paymentData);
                const record = paymentStoreService.createPaymentRecord(result.id, Constants.PROVIDERS.PROVIDER_ONE, result);

                return res.status(201).json(responseHandlers.formatSuccessResponse(result, record.id));
            } catch (primaryError) {
                console.error('Provider One failed, trying Provider Two:', primaryError.message);

                try {
                    const fallbackProvider = paymentProviderFactory.getFallbackProvider();
                    const result = await fallbackProvider.processPayment(paymentData);
                    const record = paymentStoreService.createPaymentRecord(result.id, Constants.PROVIDERS.PROVIDER_TWO, result);

                    return res.status(201).json(responseHandlers.formatSuccessResponse(result, record.id));
                } catch (fallbackError) {
                    return responseHandlers.handleProviderFailures(res, primaryError, fallbackError);
                }
            }
        } catch (error) {
            return responseHandlers.handleErrorResponse(res, 500, 'Error processing payment', error);
        }
    }

    /**
     * Retrieves payment details for a specific transaction
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} - JSON response with payment details
     */
    async getPaymentDetails(req, res) {
        try {
            const {id} = req.params;

            if (!this.validateRequest(res, null, 'id', id)) {
                return;
            }

            const paymentRecord = await this.getPaymentRecordOrFail(id, res);
            if (!paymentRecord) return;

            try {
                const provider = paymentProviderFactory.getProvider(paymentRecord.providerName);
                const details = await provider.getPaymentDetails(paymentRecord.providerId);

                return res.status(200).json({
                    ...details,
                    transactionId: id
                });
            } catch (error) {
                return res.status(404).json({
                    message: 'Payment not found or provider unavailable',
                    error: error.message
                });
            }
        } catch (error) {
            return responseHandlers.handleErrorResponse(res, 500, 'Error retrieving payment details', error);
        }
    }

    /**
     * Processes a refund request for an existing payment
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} - JSON response with refund result
     */
    async processRefund(req, res) {
        try {
            const {id} = req.params;
            const refundData = req.body;

            if (!this.validateRequest(res, null, 'id', id) ||
                !this.validateRequest(res, refundData, 'refund')) {
                return;
            }

            const paymentRecord = await this.getPaymentRecordOrFail(id, res);
            if (!paymentRecord) return;

            try {
                const provider = paymentProviderFactory.getProvider(paymentRecord.providerName);
                const result = await provider.processRefund(paymentRecord.providerId, refundData);

                return res.status(200).json({
                    ...result,
                    transactionId: id
                });
            } catch (error) {
                return res.status(400).json({
                    message: 'Failed to process refund',
                    error: error.message
                });
            }
        } catch (error) {
            return responseHandlers.handleErrorResponse(res, 500, 'Error processing refund', error);
        }
    }
}

/**
 * @type {PaymentController} Payment controller class
 * Exports the PaymentController class directly
 */
module.exports = PaymentController;