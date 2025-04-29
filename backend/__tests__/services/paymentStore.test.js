const paymentRepository = require('../../src/repositories/paymentStoreRepository');
const paymentStoreService = require('../../src/services/paymentStoreService');

jest.mock('../../src/repositories/paymentStoreRepository');

describe('PaymentStoreService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createPaymentRecord', () => {
        it('should create a payment record successfully', () => {
            const providerId = 'pmt_123456';
            const providerName = 'provider_one';
            const responseData = {
                id: providerId,
                status: 'succeeded',
                amount: 100,
                created: '2023-06-15T10:30:00Z'
            };

            const mockSavedRecord = {
                id: 'record_123',
                providerId,
                providerName,
                responseData,
                createdAt: '2023-06-15T10:30:00Z'
            };

            paymentRepository.savePaymentRecord.mockReturnValue(mockSavedRecord);

            const result = paymentStoreService.createPaymentRecord(providerId, providerName, responseData);

            expect(paymentRepository.savePaymentRecord).toHaveBeenCalledWith(providerId, providerName, responseData);
            expect(result).toEqual(mockSavedRecord);
        });

        it('should create a record with empty responseData when not provided', () => {
            const providerId = 'pmt_123456';
            const providerName = 'provider_one';

            const mockSavedRecord = {
                id: 'record_123',
                providerId,
                providerName,
                responseData: {},
                createdAt: '2023-06-15T10:30:00Z'
            };

            paymentRepository.savePaymentRecord.mockReturnValue(mockSavedRecord);

            const result = paymentStoreService.createPaymentRecord(providerId, providerName);

            expect(paymentRepository.savePaymentRecord).toHaveBeenCalledWith(providerId, providerName, {});
            expect(result).toEqual(mockSavedRecord);
        });
    });

    describe('getPaymentRecord', () => {
        it('should return an existing payment record', () => {
            const recordId = 'record_123';
            const mockRecord = {
                id: recordId,
                providerId: 'pmt_123456',
                providerName: 'provider_one',
                responseData: {
                    status: 'succeeded',
                    amount: 100
                },
                createdAt: '2023-06-15T10:30:00Z'
            };

            paymentRepository.getPaymentRecord.mockReturnValue(mockRecord);

            const result = paymentStoreService.getPaymentRecord(recordId);

            expect(paymentRepository.getPaymentRecord).toHaveBeenCalledWith(recordId);
            expect(result).toEqual(mockRecord);
        });

        it('should return null when record is not found', () => {
            const recordId = 'inexistente_id';

            paymentRepository.getPaymentRecord.mockReturnValue(null);

            const result = paymentStoreService.getPaymentRecord(recordId);

            expect(paymentRepository.getPaymentRecord).toHaveBeenCalledWith(recordId);
            expect(result).toBeNull();
        });
    });
});