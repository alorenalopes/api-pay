const MemoryStore = require('../repositories/providerTwoMemoryRepository');

/** Create a new transaction */
const createTransaction = (transactionData) => {
    return MemoryStore.createTransaction(transactionData);
};

/** Get transaction details by ID */
const getTransactionById = (id) => {
    return MemoryStore.getTransaction(id);
};

/** Void a transaction */
const voidTransaction = (id, amount) => {
    return MemoryStore.voidTransaction(id, amount);
};

module.exports = {
    createTransaction,
    getTransactionById,
    voidTransaction
};
