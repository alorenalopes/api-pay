const Joi = require('joi');

class PaymentValidator {
    constructor() {
        this.paymentSchema = Joi.object({
            amount: Joi.number().required().positive(),
            currency: Joi.string().required().length(3),
            description: Joi.string().allow('', null),
            paymentMethod: Joi.object({
                type: Joi.string().valid('card').required(),
                card: Joi.object({
                    number: Joi.string().required(),
                    holderName: Joi.string().required(),
                    cvv: Joi.string().required().length(3),
                    expirationDate: Joi.string().required().pattern(/^\d{2}\/\d{4}$/),
                    installments: Joi.number().integer().min(1).required()
                }).required().unknown(true)
            }).required().unknown(true)
        }).unknown(true);

        this.idParamSchema = Joi.object({
            id: Joi.string().required()
        });

        this.refundSchema = Joi.object({
            amount: Joi.number().positive()
        });
    }

    validatePayment(data) {
        return this.paymentSchema.validate(data);
    }

    validateId(id) {
        return this.idParamSchema.validate({id});
    }

    validateRefund(data) {
        return this.refundSchema.validate(data);
    }
}

module.exports = new PaymentValidator();