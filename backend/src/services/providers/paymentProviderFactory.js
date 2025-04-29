const Constants = require('../../constants/paymentConstants');
const ProviderOne = require('./ProviderOne');
const ProviderTwo = require('./ProviderTwo');

class PaymentProviderFactory {
    static getProvider(providerName) {
        switch (providerName) {
            case Constants.PROVIDERS.PROVIDER_ONE:
                return new ProviderOne();
            case Constants.PROVIDERS.PROVIDER_TWO:
                return new ProviderTwo();
            default:
                throw new Error(`Provider not supported: ${providerName}`);
        }
    }

    static getPrimaryProvider() {
        return new ProviderOne();
    }

    static getFallbackProvider() {
        return new ProviderTwo();
    }
}

module.exports = PaymentProviderFactory;