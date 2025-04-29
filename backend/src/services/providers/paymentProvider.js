class PaymentProvider {
    async processPayment(paymentData) {
        throw new Error('Method not implemented');
    }

    async getPaymentDetails(paymentId) {
        throw new Error('Method not implemented');
    }

    async processRefund(paymentId, refundData) {
        throw new Error('Method not implemented');
    }
}

module.exports = PaymentProvider;