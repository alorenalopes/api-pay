const {v4: uuidv4} = require('uuid');

/** Creates a standardized payment response object */
function createResponse(status, request) {
    const {id, amount, currency, description} = request;

    return {
        id: id,
        createdAt: new Date().toISOString().split('T')[0],
        status: status,
        originalAmount: amount || 1000,
        currentAmount: amount || 1000,
        currency: currency || "BRL",
        description: description || "Pagamento de teste",
        paymentMethod: "card",
        cardId: uuidv4()
    };
}

module.exports = {
    createResponse
};
