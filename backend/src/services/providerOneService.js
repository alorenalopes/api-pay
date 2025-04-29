const {get, post} = require('../clients/client');
require('dotenv').config();


class ProviderOneService {
    /**
     * Processes a new payment charge
     * @async
     * @param {Object} paymentData - Payment data to be processed
     * @param {number} paymentData.amount - Payment amount
     * @param {string} paymentData.currency - Currency code
     * @param {Object} paymentData.paymentMethod - Payment method details
     * @returns {Promise<Object>} Processed charge result
     * @throws {Error} If the request fails
     */
    async processCharge(paymentData) {
        try {
            return await post('/charges', paymentData);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves charge details by ID
     * @async
     * @param {string} chargeId - ID of the charge to query
     * @returns {Promise<Object>} Charge details
     * @throws {Error} If charge is not found or API error occurs
     */
    async getChargeDetails(chargeId) {
        try {
            return await get(`/charges/${chargeId}`);
        } catch (error) {
            console.error(`Error retrieving charge details ${chargeId} (Provider One):`, error);
            throw error;
        }
    }

    /**
     * Processes a refund for a charge
     * @async
     * @param {string} chargeId - ID of the charge to refund
     * @param {Object} refundData - Refund data
     * @param {number} [refundData.amount] - Refund amount (optional, full refund if omitted)
     * @param {string} [refundData.reason] - Reason for refund
     * @returns {Promise<Object>} Processed refund result
     * @throws {Error} If refund cannot be processed
     */
    async processRefund(chargeId, refundData) {
        try {
            return await post(`/refund/${chargeId}`, refundData);
        } catch (error) {
            console.error(`Error processing refund for charge ${chargeId} (Provider One):`, error);
            throw error;
        }
    }
}

const providerOneService = new ProviderOneService();
module.exports = providerOneService;