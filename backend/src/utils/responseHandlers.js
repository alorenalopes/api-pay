const Constants = require('../constants/paymentConstants');


class ResponseHandler {

    handleErrorResponse(res, statusCode, message, error) {
        console.error(`${message}:`, error);
        return res.status(statusCode).json({
            message,
            error: error.message
        });
    }

    handleProviderFailures(res, primaryError, fallbackError) {
        return res.status(503).json({
            message: 'Payment service unavailable, all providers failed',
            errors: [
                {provider: Constants.PROVIDERS.PROVIDER_ONE, error: primaryError?.message || 'Unknown error'},
                {provider: Constants.PROVIDERS.PROVIDER_TWO, error: fallbackError?.message || 'Unknown error'}
            ]
        });
    }

    formatSuccessResponse(result, transactionId) {
        const {id, ...resultWithoutId} = result;
        return {
            ...resultWithoutId,
            transactionId
        };
    }

    handleValidationError(res, error) {
        return res.status(400).json({
            message: 'Validation error',
            error: error.details.map(detail => detail.message).join(', ')
        });
    }
}

const responseHandler = new ResponseHandler();
module.exports = responseHandler;