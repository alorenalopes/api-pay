const {post, get} = require('../clients/client');
require('dotenv').config();

class ProviderTwoService {
    /**
     * Processes a new payment transaction
     * @async
     * @param {Object} transactionData - Transaction data to be processed
     * @param {number} transactionData.amount - Transaction amount
     * @param {string} transactionData.currency - Currency code
     * @param {string} transactionData.paymentType - Payment type
     * @param {Object} transactionData.card - Card details (for card payments)
     * @returns {Promise<Object>} Processed transaction result
     * @throws {Error} If the request fails
     */
    async processTransaction(transactionData) {
        try {
            return await post('/transactions', transactionData);
        } catch (error) {
            console.error('Error processing transaction (Provider Two):', error);
            throw error;
        }
    }

    /**
     * Retrieves transaction details by ID
     * @async
     * @param {string} transactionId - ID of the transaction to query
     * @returns {Promise<Object>} Transaction details
     * @throws {Error} If transaction is not found or API error occurs
     */
    async getTransactionDetails(transactionId) {
        try {
            return await get(`/transactions/${transactionId}`);
        } catch (error) {
            console.error(`Error retrieving transaction details ${transactionId} (Provider Two):`, error);
            throw error;
        }
    }

    /**
     * Processes void/cancellation of a transaction
     * @async
     * @param {string} transactionId - ID of the transaction to void
     * @param {Object} voidData - Void data
     * @param {string} [voidData.reason] - Reason for voiding
     * @returns {Promise<Object>} Void processing result
     * @throws {Error} If void cannot be processed
     */
    async processVoid(transactionId, voidData) {
        try {
            return await post(`/void/${transactionId}`, voidData);
        } catch (error) {
            console.error(`Error processing void for transaction ${transactionId} (Provider Two):`, error);
            throw error;
        }
    }
}

const providerTwoService = new ProviderTwoService();
module.exports = providerTwoService;