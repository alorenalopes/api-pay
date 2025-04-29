const providerOneService = require('../services/providerOneService');
const ValidationSchemas = require('../schemas/validationSchemas');
const {STATUS} = require('../constants/statusConstants');

/** Process a new charge */
const processCharge = (req, res) => {
    const validation = ValidationSchemas.validate(ValidationSchemas.payment, req.body);

    if (!validation.isValid) {
        return res.status(400).json({
            status: STATUS.ERROR,
            message: validation.error
        });
    }

    const charge = providerOneService.createCharge(req.body);

    if (charge.status === STATUS.FAILED) {
        return res.status(500).json(charge);
    }

    return res.status(201).json(charge);
};

/** Get charge details */
const getChargeDetails = (req, res) => {
    const {id} = req.params;

    const validation = ValidationSchemas.validate(ValidationSchemas.idParam, req.params);

    if (!validation.isValid) {
        return res.status(400).json({
            status: STATUS.ERROR,
            message: validation.error
        });
    }

    const charge = providerOneService.getChargeById(id);

    if (!charge) {
        return res.status(404).json({
            status: STATUS.ERROR,
            message: 'Charge not found'
        });
    }

    return res.json(charge);
};

/** Process refund for a charge */
const processRefund = (req, res) => {
    const {id} = req.params;

    const validation = ValidationSchemas.validate(ValidationSchemas.idParam, req.params);

    if (!validation.isValid) {
        return res.status(400).json({
            status: STATUS.ERROR,
            message: validation.error
        });
    }

    const {amount} = req.body || {};

    const updatedCharge = providerOneService.refundCharge(id, amount);

    if (!updatedCharge) {
        return res.status(404).json({
            status: STATUS.ERROR,
            message: 'Charge not found'
        });
    }

    return res.json(updatedCharge);
};

module.exports = {
    processCharge,
    getChargeDetails,
    processRefund
};