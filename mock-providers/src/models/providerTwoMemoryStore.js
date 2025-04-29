const {createResponse} = require('../factories/paymentFactories');
const {v4: uuidv4} = require('uuid');
const PaymentConstants = require('../constants/paymentConstants');

const transactions = new Map();

/** Process payment status based on last card digit */
const _processStatus = (lastDigit) => {
    return lastDigit === PaymentConstants.CARD.SUCCESSFUL_PAYMENT_DIGIT
        ? PaymentConstants.STATUS.PAID
        : PaymentConstants.STATUS.FAILED;
};

/** Create and store a new transaction */
const createTransaction = (transactionData) => {
    const id = uuidv4();

    const lastDigit = transactionData.card.number.slice(-1);
    const status = _processStatus(lastDigit);

    const transaction = createResponse(status, {
        id,
        amount: transactionData.amount,
        currency: transactionData.currency,
        description: transactionData.statementDescriptor
    });

    transactions.set(id, transaction);

    return transaction;
};

/** Get a transaction by ID */
const getTransaction = (id) => {
    return transactions.get(id) || null;
};

/** Void/cancel a transaction */
const voidTransaction = (id, amount) => {
    const transaction = transactions.get(id);

    if (!transaction) {
        return null;
    }

    if (transaction.status === PaymentConstants.STATUS.VOIDED) {
        return transaction;
    }

    transaction.status = PaymentConstants.STATUS.VOIDED;
    if (amount) {
        transaction.currentAmount -= amount;
    } else {
        transaction.currentAmount = PaymentConstants.TRANSACTION.DEFAULT_AMOUNT;
    }

    transactions.set(id, transaction);

    return transaction;
};

module.exports = {
    createTransaction,
    getTransaction,
    voidTransaction
};
