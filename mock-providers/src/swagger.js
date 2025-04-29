const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mock Payment Providers API',
            version: '1.0.0',
            description: 'API for simulating multiple payment providers with different formats'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        tags: [
            {
                name: 'Provider One',
                description: 'First payment provider operations'
            },
            {
                name: 'Provider Two',
                description: 'Second payment provider operations'
            }
        ],
        paths: {
            '/charges': {
                post: {
                    tags: ['Provider One'],
                    summary: 'Create a new charge',
                    description: 'Process a new payment charge',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ProviderOneChargeRequest'
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Charge created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ProviderOneChargeResponse'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid request data'
                        },
                        500: {
                            description: 'Payment processing failed'
                        }
                    }
                }
            },
            '/charges/{id}': {
                get: {
                    tags: ['Provider One'],
                    summary: 'Get charge details',
                    description: 'Retrieve information about an existing charge',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            schema: {
                                type: 'string'
                            },
                            required: true,
                            description: 'Charge ID'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Charge retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ProviderOneChargeResponse'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Charge not found'
                        }
                    }
                }
            },
            '/refund/{id}': {
                post: {
                    tags: ['Provider One'],
                    summary: 'Create refund',
                    description: 'Process a refund for an existing charge',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            schema: {
                                type: 'string'
                            },
                            required: true,
                            description: 'Charge ID to refund'
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
                                            description: 'Amount to refund (optional for partial refund)'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Refund processed successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ProviderOneChargeResponse'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid refund request'
                        },
                        404: {
                            description: 'Charge not found'
                        }
                    }
                }
            },
            '/transactions': {
                post: {
                    tags: ['Provider Two'],
                    summary: 'Create a new transaction',
                    description: 'Process a new payment transaction',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ProviderTwoTransactionRequest'
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Transaction created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ProviderTwoTransactionResponse'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid request data'
                        },
                        500: {
                            description: 'Transaction processing failed'
                        }
                    }
                }
            },
            '/transactions/{id}': {
                get: {
                    tags: ['Provider Two'],
                    summary: 'Get transaction details',
                    description: 'Retrieve information about an existing transaction',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            schema: {
                                type: 'string'
                            },
                            required: true,
                            description: 'Transaction ID'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Transaction retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ProviderTwoTransactionResponse'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Transaction not found'
                        }
                    }
                }
            },
            '/void/{id}': {
                post: {
                    tags: ['Provider Two'],
                    summary: 'Void a transaction',
                    description: 'Void (refund) an existing transaction',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            schema: {
                                type: 'string'
                            },
                            required: true,
                            description: 'Transaction ID to void'
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
                                            description: 'Amount to void (optional for partial void)'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Transaction voided successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ProviderTwoTransactionResponse'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid void request'
                        },
                        404: {
                            description: 'Transaction not found'
                        }
                    }
                }
            }
        },
        components: {
            schemas: {
                ProviderOneChargeRequest: {
                    type: 'object',
                    required: ['amount', 'currency', 'paymentMethod'],
                    properties: {
                        amount: {
                            type: 'number',
                            description: 'Amount to charge'
                        },
                        currency: {
                            type: 'string',
                            description: 'Currency in ISO 4217 format (e.g. USD)',
                            example: 'USD'
                        },
                        description: {
                            type: 'string',
                            description: 'Charge description'
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
                                            description: 'Name on the card'
                                        },
                                        cvv: {
                                            type: 'string',
                                            description: 'Security code'
                                        },
                                        expirationDate: {
                                            type: 'string',
                                            description: 'Expiration date in format DD/YYYY',
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
                ProviderOneChargeResponse: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique transaction ID'
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
                            description: 'Currency in ISO 4217 format (e.g. USD)',
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
                        cardId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Reference ID of the card used'
                        }
                    }
                },
                ProviderOneRefundRequest: {
                    type: 'object',
                    required: ['chargeId'],
                    properties: {
                        chargeId: {
                            type: 'string',
                            description: 'ID of the charge to refund'
                        },
                        amount: {
                            type: 'number',
                            description: 'Amount to refund (if partial refund)'
                        }
                    }
                },
                ProviderTwoTransactionRequest: {
                    type: 'object',
                    required: ['amount', 'currency', 'paymentType', 'card'],
                    properties: {
                        amount: {
                            type: 'number',
                            description: 'Transaction amount'
                        },
                        currency: {
                            type: 'string',
                            description: 'Currency in ISO 4217 format (e.g. USD)',
                            example: 'USD'
                        },
                        statementDescriptor: {
                            type: 'string',
                            description: 'Description that appears on the statement'
                        },
                        paymentType: {
                            type: 'string',
                            enum: ['card'],
                            description: 'Payment method type'
                        },
                        card: {
                            type: 'object',
                            required: ['number', 'holder', 'cvv', 'expiration'],
                            properties: {
                                number: {
                                    type: 'string',
                                    description: 'Card number'
                                },
                                holder: {
                                    type: 'string',
                                    description: 'Cardholder name'
                                },
                                cvv: {
                                    type: 'string',
                                    description: 'Security code'
                                },
                                expiration: {
                                    type: 'string',
                                    description: 'Expiration date (DD/YY)',
                                    example: '12/25'
                                },
                                installmentNumber: {
                                    type: 'number',
                                    description: 'Number of installments',
                                    default: 1
                                }
                            }
                        }
                    }
                },
                ProviderTwoTransactionResponse: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique transaction ID'
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
                            description: 'Currency in ISO 4217 format (e.g. USD)',
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
                        cardId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Reference ID of the card used'
                        }
                    }
                },
                ProviderTwoVoidRequest: {
                    type: 'object',
                    required: ['transactionId'],
                    properties: {
                        transactionId: {
                            type: 'string',
                            description: 'ID of the transaction to void'
                        },
                        amount: {
                            type: 'number',
                            description: 'Amount to void (optional for partial void)'
                        },
                        reason: {
                            type: 'string',
                            description: 'Reason for voiding'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js'] // Path to route files
};

const specs = swaggerJsDoc(options);

module.exports = specs;
