const providerOneService = require('../providerOneService');
const PaymentProvider = require('./paymentProvider');

class ProviderOne extends PaymentProvider {
    async processPayment(paymentData) {
        return await providerOneService.processCharge(paymentData);
    }

    async getPaymentDetails(paymentId) {
        return await providerOneService.getChargeDetails(paymentId);
    }

    async processRefund(paymentId, refundData) {
        return await providerOneService.processRefund(paymentId, refundData);
    }
}

module.exports = ProviderOne;