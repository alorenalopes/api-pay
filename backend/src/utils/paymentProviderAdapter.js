class PaymentProviderAdapter {
    /**
     * Converts payment data from ProviderOne format to ProviderTwo format
     * @param {Object} providerOneData - Data in ProviderOne format
     * @param {number} providerOneData.amount - Payment amount
     * @param {string} providerOneData.currency - Currency code
     * @param {string} [providerOneData.description] - Payment description
     * @param {Object} [providerOneData.paymentMethod] - Payment method details
     * @param {Object} [providerOneData.paymentMethod.card] - Card payment details
     * @returns {Object} Data formatted for ProviderTwo
     * @throws {Error} If payment data is missing or invalid
     */
    convertToProviderTwoFormat(providerOneData) {
        if (!providerOneData) {
            throw new Error('Payment data is required');
        }

        const cardData = providerOneData.paymentMethod?.card || {};

        let expiration = "";
        if (cardData.expirationDate) {
            const parts = cardData.expirationDate.split('/');
            if (parts.length === 2) {
                const year = parts[1].slice(-2);
                expiration = `${parts[0]}/${year}`;
            } else {
                expiration = cardData.expirationDate;
            }
        }

        return {
            amount: providerOneData.amount,
            currency: providerOneData.currency,
            statementDescriptor: providerOneData.description || "",
            paymentType: "card",
            card: {
                number: cardData.number || "",
                holder: cardData.holderName || "",
                cvv: cardData.cvv || "",
                expiration: expiration,
                installmentNumber: cardData.installments || 1
            }
        };
    }
}

const paymentProviderAdapter = new PaymentProviderAdapter();
module.exports = paymentProviderAdapter;