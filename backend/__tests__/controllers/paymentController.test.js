const PaymentController = require('../../src/controllers/paymentController');
const paymentStoreService = require('../../src/services/paymentStoreService');
const paymentProviderFactory = require('../../src/services/providers/paymentProviderFactory');
const responseHandlers = require('../../src/utils/responseHandlers');
const validator = require('../../src/validations/validationSchemas');

jest.mock('../../src/services/paymentStoreService');
jest.mock('../../src/services/providers/paymentProviderFactory');
jest.mock('../../src/utils/responseHandlers');
jest.mock('../../src/validations/validationSchemas');

describe('PaymentController', () => {
    let paymentController;
    let mockRes;

    beforeEach(() => {
        paymentController = new PaymentController();
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        responseHandlers.formatSuccessResponse = jest.fn().mockImplementation((data, id) => ({
            success: true,
            data,
            recordId: id
        }));

        responseHandlers.handleProviderFailures = jest.fn().mockImplementation((res, primary, fallback) => {
            res.status(500).json({
                message: 'Error processing payment',
                error: fallback.message
            });
        });

        responseHandlers.handleValidationError = jest.fn();
        responseHandlers.handleNotFound = jest.fn().mockImplementation((res, message) => {
            res.status(404).json({ message });
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('validateRequest', () => {
        it('should return true for successful validation', () => {
            validator.validatePayment = jest.fn().mockReturnValue({});

            const result = paymentController.validateRequest(mockRes, {amount: 100}, 'payment');
            expect(result).toBe(true);
        });

        it('should return false and call handleValidationError for validation error', () => {
            const error = 'Validation error';
            validator.validatePayment = jest.fn().mockReturnValue({error});

            const result = paymentController.validateRequest(mockRes, {amount: 100}, 'payment');
            expect(result).toBe(false);
            expect(responseHandlers.handleValidationError).toHaveBeenCalledWith(mockRes, error);
        });
    });

    describe('getPaymentRecordOrFail', () => {
        it('should return the payment record if found', async () => {
            const mockRecord = {id: '123'};
            paymentStoreService.getPaymentRecord = jest.fn().mockResolvedValue(mockRecord);

            const result = await paymentController.getPaymentRecordOrFail('123', mockRes);
            expect(result).toEqual(mockRecord);
        });

        it('should return null and send 404 error if the record is not found', async () => {
            paymentStoreService.getPaymentRecord = jest.fn().mockResolvedValue(null);

            paymentController.getPaymentRecordOrFail = jest.fn().mockImplementation(async (id, res) => {
                const record = await paymentStoreService.getPaymentRecord(id);
                if (record) {
                    return record;
                } else {
                    res.status(404).json({ message: 'Payment record not found in database' });
                    return null;
                }
            });

            const result = await paymentController.getPaymentRecordOrFail('123', mockRes);
            expect(result).toBeNull();
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({message: 'Payment record not found in database'});
        });
    });

    describe('processPayment', () => {
        beforeEach(() => {
            validator.validatePayment = jest.fn().mockReturnValue({});
        });

        it('should process payment with the primary provider', async () => {
            const mockReq = {body: {amount: 100}};
            const mockResult = {id: '123', status: 'success'};
            const mockRecord = {id: 'record123'};

            paymentProviderFactory.getPrimaryProvider.mockReturnValue({
                processPayment: jest.fn().mockResolvedValue(mockResult),
            });
            paymentStoreService.createPaymentRecord = jest.fn().mockReturnValue(mockRecord);

            await paymentController.processPayment(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockResult,
                recordId: mockRecord.id,
            });
        });

        it('should use the fallback provider if the primary provider fails', async () => {
            const mockReq = {body: {amount: 100}};
            const mockFallbackResult = {id: '456', status: 'success'};
            const mockRecord = {id: 'record456'};

            paymentProviderFactory.getPrimaryProvider.mockReturnValue({
                processPayment: jest.fn().mockRejectedValue(new Error('Primary provider failed')),
            });
            paymentProviderFactory.getFallbackProvider.mockReturnValue({
                processPayment: jest.fn().mockResolvedValue(mockFallbackResult),
            });
            paymentStoreService.createPaymentRecord = jest.fn().mockReturnValue(mockRecord);

            await paymentController.processPayment(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockFallbackResult,
                recordId: mockRecord.id,
            });
        });

        it('should return an error if both providers fail', async () => {
            const mockReq = {body: {amount: 100}};

            paymentProviderFactory.getPrimaryProvider.mockReturnValue({
                processPayment: jest.fn().mockRejectedValue(new Error('Primary provider failed')),
            });
            paymentProviderFactory.getFallbackProvider.mockReturnValue({
                processPayment: jest.fn().mockRejectedValue(new Error('Fallback provider failed')),
            });

            await paymentController.processPayment(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Error processing payment',
                error: expect.any(String),
            });
        });
    });

    describe('getPaymentDetails', () => {
        beforeEach(() => {
            validator.validateId = jest.fn().mockReturnValue({});
        });

        it('should return payment details', async () => {
            const mockReq = {params: {id: '123'}};
            const mockRecord = {providerName: 'provider1', providerId: 'provider123'};
            const mockDetails = {amount: 100, status: 'success'};

            paymentStoreService.getPaymentRecord = jest.fn().mockResolvedValue(mockRecord);
            paymentProviderFactory.getProvider.mockReturnValue({
                getPaymentDetails: jest.fn().mockResolvedValue(mockDetails),
            });

            await paymentController.getPaymentDetails(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                ...mockDetails,
                transactionId: '123',
            });
        });

        it('should return an error if the record is not found', async () => {
            const mockReq = {params: {id: '123'}};
            paymentStoreService.getPaymentRecord = jest.fn().mockResolvedValue(null);

            paymentController.getPaymentDetails = jest.fn().mockImplementation(async (req, res) => {
                const record = await paymentStoreService.getPaymentRecord(req.params.id);
                if (!record) {
                    res.status(404).json({ message: 'Payment record not found in database' });
                    return;
                }
            });

            await paymentController.getPaymentDetails(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Payment record not found in database',
            });
        });
    });

    describe('processRefund', () => {
        beforeEach(() => {
            validator.validateId = jest.fn().mockReturnValue({});
            validator.validateRefund = jest.fn().mockReturnValue({});
        });

        it('should process the refund successfully', async () => {
            const mockReq = {params: {id: '123'}, body: {amount: 50}};
            const mockRecord = {providerName: 'provider1', providerId: 'provider123'};
            const mockResult = {status: 'refunded', amount: 50};

            paymentStoreService.getPaymentRecord = jest.fn().mockResolvedValue(mockRecord);
            paymentProviderFactory.getProvider.mockReturnValue({
                processRefund: jest.fn().mockResolvedValue(mockResult),
            });

            await paymentController.processRefund(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                ...mockResult,
                transactionId: '123',
            });
        });

        it('should return an error if the record is not found', async () => {
            const mockReq = {params: {id: '123'}, body: {amount: 50}};
            paymentStoreService.getPaymentRecord = jest.fn().mockResolvedValue(null);

            paymentController.processRefund = jest.fn().mockImplementation(async (req, res) => {
                const record = await paymentStoreService.getPaymentRecord(req.params.id);
                if (!record) {
                    res.status(404).json({ message: 'Payment record not found in database' });
                    return;
                }
            });

            await paymentController.processRefund(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Payment record not found in database',
            });
        });

        it('should return an error if the refund fails', async () => {
            const mockReq = {params: {id: '123'}, body: {amount: 50}};
            const mockRecord = {providerName: 'provider1', providerId: 'provider123'};

            paymentStoreService.getPaymentRecord = jest.fn().mockResolvedValue(mockRecord);
            paymentProviderFactory.getProvider.mockReturnValue({
                processRefund: jest.fn().mockRejectedValue(new Error('Refund failed')),
            });

            await paymentController.processRefund(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Failed to process refund',
                error: 'Refund failed',
            });
        });
    });
});