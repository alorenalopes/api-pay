const Joi = require('joi');

class ValidationSchemas {
    static get payment() {
        return Joi.object({
            amount: Joi.number().required(),
            currency: Joi.string().required(),
            description: Joi.string().required(),
            paymentMethod: Joi.object({
                card: Joi.object({
                    number: Joi.string().required()
                }).required()
            }).required()
        }).unknown(true);
    }

    static get transaction() {
        return Joi.object({
            amount: Joi.number().required(),
            card: Joi.object({
                number: Joi.string().required()
            }).required()
        }).unknown(true);
    }

    static get idParam() {
        return Joi.object({
            id: Joi.string().required()
        }).unknown(true);
    }

    static getPartialSchema(schema) {
        const clonedSchema = schema.fork(
            Object.keys(schema.describe().keys),
            (schema) => schema.optional()
        );
        return clonedSchema.unknown(true);
    }

    static validate(schema, data, options = {abortEarly: false, allowUnknown: true}) {
        const {error} = schema.validate(data, options);
        return {
            isValid: !error,
            error: error ? error.details[0].message : null
        };
    }
}

module.exports = ValidationSchemas;
