const providerTwoService = require('../providerTwoService');
const paymentProviderAdapter = require('../../utils/paymentProviderAdapter');
const PaymentProvider = require('./paymentProvider');

class ProviderTwo extends PaymentProvider {
    async processPayment(paymentData) {
        const formattedData = paymentProviderAdapter.convertToProviderTwoFormat(paymentData);
        return await providerTwoService.processTransaction(formattedData);
    }

    async getPaymentDetails(paymentId) {
        return await providerTwoService.getTransactionDetails(paymentId);
    }

    async processRefund(paymentId, refundData) {
        return await providerTwoService.processVoid(paymentId, refundData);
    }
}

module.exports = ProviderTwo;