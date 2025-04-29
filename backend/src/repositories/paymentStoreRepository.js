const {v4: uuidv4} = require('uuid');


class PaymentStoreRepository {

    constructor() {
        this.paymentRecords = new Map();
    }

    /**
     * Saves a payment record with provider information and complete response data
     * @param {string} providerId - ID from payment provider
     * @param {string} providerName - Name of the payment provider
     * @param {Object} responseData - Complete response data from service layer
     * @returns {Object} Created payment record
     */
    savePaymentRecord(providerId, providerName, responseData = {}) {
        const id = uuidv4();

        const record = {
            id,
            providerId,
            providerName,
            timestamp: new Date().toISOString(),
            responseData
        };

        this.paymentRecords.set(id, record);

        return record;
    }

    /**
     * Retrieves a payment record by ID
     * @param {string} id - Payment record ID
     * @returns {Object|null} Payment record or null if not found
     */
    getPaymentRecord(id) {
        return this.paymentRecords.get(id) || null;
    }
}

const repository = new PaymentStoreRepository();

module.exports = repository;