const STATUS = {
    PAID: 'paid',
    FAILED: 'failed',
    VOIDED: 'voided',
    SUCCEEDED: 'succeeded',
    REFUNDED: 'refunded'
};

const CARD = {
    SUCCESSFUL_PAYMENT_DIGIT: '1',
    SUCCESSFUL_CHARGE_DIGIT: '0'
};

const TRANSACTION = {
    DEFAULT_AMOUNT: 0
};

module.exports = {
    STATUS,
    CARD,
    TRANSACTION
};
