const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Pay Service',
            version: '1.0.0',
            description: 'Payment services integration API'
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server'
            }
        ],
        tags: [
            {
                name: 'Payments',
                description: 'Payment operations'
            }
        ],
        paths: {
            '/api-pay/payments': {
                post: {
                    tags: ['Payments'],
                    summary: 'Process a new payment',
                    description: 'Sends a payment request to the specified provider',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/validations/PaymentRequest'
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Payment successfully processed',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/validations/PaymentResponse'
                                    }
                                }
                            }
                        },
                        503: {
                            description: 'Payment service unavailable, all providers failed',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/validations/Error'
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/validations/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api-pay/payments/{id}': {
                get: {
                    tags: ['Payments'],
                    summary: 'Get payment details',
                    description: 'Returns the details of a specific payment by ID',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'Payment ID',
                            schema: {
                                type: 'string'
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Payment details successfully retrieved',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/validations/PaymentResponse'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid payment ID format',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/validations/Error'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Payment not found or provider unavailable',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/validations/Error'
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/validations/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api-pay/payments/{id}/refund': {
                post: {
                    tags: ['Payments'],
                    summary: 'Process a refund',
                    description: 'Request a refund for a specific payment',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'ID of the payment to be refunded',
                            schema: {
                                type: 'string'
                            }
                        }
                    ],
                    requestBody: {
                        required: false,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        amount: {
                                            type: 'number',
                                            description: 'Amount to be refunded (optional, default is the total amount)'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Refund successfully processed',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/validations/PaymentResponse'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid payment ID format or failed to process refund',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/validations/Error'
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/validations/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        components: {
            schemas: {
                PaymentRequest: {
                    type: 'object',
                    required: ['amount', 'currency', 'paymentMethod'],
                    properties: {
                        amount: {
                            type: 'number',
                            description: 'Payment amount'
                        },
                        currency: {
                            type: 'string',
                            description: 'Currency in ISO 4217 format (e.g. USD, EUR)',
                            example: 'USD'
                        },
                        description: {
                            type: 'string',
                            description: 'Payment description'
                        },
                        paymentMethod: {
                            type: 'object',
                            required: ['type', 'card'],
                            properties: {
                                type: {
                                    type: 'string',
                                    enum: ['card'],
                                    description: 'Payment method'
                                },
                                card: {
                                    type: 'object',
                                    required: ['number', 'holderName', 'cvv', 'expirationDate'],
                                    properties: {
                                        number: {
                                            type: 'string',
                                            description: 'Card number'
                                        },
                                        holderName: {
                                            type: 'string',
                                            description: 'Cardholder name'
                                        },
                                        cvv: {
                                            type: 'string',
                                            description: 'Security code'
                                        },
                                        expirationDate: {
                                            type: 'string',
                                            description: 'Expiration date in DD/YYYY format',
                                            example: '12/2025'
                                        },
                                        installments: {
                                            type: 'number',
                                            description: 'Number of installments',
                                            default: 1
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                PaymentResponse: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Transaction ID'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date',
                            description: 'Creation date in yyyy-mm-dd format'
                        },
                        status: {
                            type: 'string',
                            enum: ['authorized', 'failed', 'refunded'],
                            description: 'Current payment status'
                        },
                        originalAmount: {
                            type: 'number',
                            description: 'Original payment amount'
                        },
                        currentAmount: {
                            type: 'number',
                            description: 'Current amount after partial refunds'
                        },
                        currency: {
                            type: 'string',
                            description: 'Currency in ISO 4217 format (e.g. USD, EUR)',
                            example: 'USD'
                        },
                        description: {
                            type: 'string',
                            description: 'Payment description'
                        },
                        paymentMethod: {
                            type: 'string',
                            enum: ['card'],
                            description: 'Payment method used'
                        },
                        provider: {
                            type: 'string',
                            description: 'Payment provider used',
                            example: 'provider-one'
                        },
                        cardId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Reference ID of the card used'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Error message'
                        },
                        error: {
                            type: 'string',
                            description: 'Error details'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    provider: {
                                        type: 'string',
                                        description: 'Provider name'
                                    },
                                    error: {
                                        type: 'string',
                                        description: 'Error message from provider'
                                    }
                                }
                            },
                            description: 'List of provider errors in case of multiple failures'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
};

const specs = swaggerJsDoc(options);

module.exports = specs;
