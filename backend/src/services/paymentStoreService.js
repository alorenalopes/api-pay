const paymentRepository = require('../repositories/paymentStoreRepository');

class PaymentStoreService {
    /**
     * Creates a new payment record in the store
     * @param {string} providerId - ID from payment provider
     * @param {string} providerName - Name of the payment provider
     * @param {Object} responseData - Complete response data from service layer
     * @returns {Object} Created payment record
     */
    createPaymentRecord(providerId, providerName, responseData = {}) {
        return paymentRepository.savePaymentRecord(providerId, providerName, responseData);
    }

    /**
     * Retrieves a payment record by ID
     * @param {string} id - Payment record ID
     * @returns {Object|null} Payment record or null if not found
     */
    getPaymentRecord(id) {
        return paymentRepository.getPaymentRecord(id);
    }
}

const paymentStoreService = new PaymentStoreService();

module.exports = paymentStoreService;