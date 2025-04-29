const {createResponse} = require('../utils/paymentAdapter');
const {v4: uuidv4} = require('uuid');
const PaymentConstants = require('../constants/paymentConstants');

const charges = new Map();

/** Process payment status based on last card digit */
const _processStatus = (lastDigit) => {
    return lastDigit === PaymentConstants.CARD.SUCCESSFUL_CHARGE_DIGIT
        ? PaymentConstants.STATUS.SUCCEEDED
        : PaymentConstants.STATUS.FAILED;
};

/** Create and store a new charge */
const createCharge = (chargeData) => {
    const id = uuidv4();

    const lastDigit = chargeData.paymentMethod.card.number.slice(-1);
    const status = _processStatus(lastDigit);

    const charge = createResponse(status, {
        id,
        amount: chargeData.amount,
        currency: chargeData.currency,
        description: chargeData.description
    });

    charges.set(id, charge);

    return charge;
};

/** Get a charge by ID */
const getCharge = (id) => {
    return charges.get(id) || null;
};

/** Refund a charge */
const refundCharge = (id, amount) => {
    const charge = charges.get(id);

    if (!charge) {
        return null;
    }

    if (charge.status === PaymentConstants.STATUS.REFUNDED) {
        return charge;
    }

    charge.status = PaymentConstants.STATUS.REFUNDED;
    if (amount) {
        charge.currentAmount -= amount;
    } else {
        charge.currentAmount = PaymentConstants.TRANSACTION.DEFAULT_AMOUNT;
    }

    charges.set(id, charge);

    return charge;
};

module.exports = {
    createCharge,
    getCharge,
    refundCharge
};
