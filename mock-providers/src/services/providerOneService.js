const MemoryStore = require('../repositories/providerOneMemoryRepository');

/** Create a new charge */
const createCharge = (chargeData) => {
    return MemoryStore.createCharge(chargeData);
};

/** Get charge details by ID */
const getChargeById = (id) => {
    return MemoryStore.getCharge(id);
};

/** Process refund for a charge */
const refundCharge = (id, refundData) => {
    return MemoryStore.refundCharge(id, refundData);
};

module.exports = {
    createCharge,
    getChargeById,
    refundCharge
};
