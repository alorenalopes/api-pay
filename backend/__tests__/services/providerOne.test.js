const client = require('../../src/clients/client');
const providerOneService = require('../../src/services/providerOneService');

jest.mock('../../src/clients/client');

describe('ProviderOneService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('processCharge', () => {
        it('should process a charge successfully', async () => {
            const paymentData = {
                amount: 100,
                currency: 'USD',
                paymentMethod: {
                    type: 'card',
                    number: '4111111111111111'
                }
            };

            const mockResponse = {
                id: 'ch_123456',
                status: 'succeeded',
                amount: 100
            };

            client.post.mockResolvedValue(mockResponse);

            const result = await providerOneService.processCharge(paymentData);

            expect(client.post).toHaveBeenCalledWith('/charges', paymentData);
            expect(result).toEqual(mockResponse);
        });

        it('should throw error when charge is rejected', async () => {
            const paymentData = {
                amount: 100,
                currency: 'USD',
                paymentMethod: {
                    type: 'card',
                    number: '4111111111111111'
                }
            };

            const mockError = new Error('Failed to process charge');
            client.post.mockRejectedValue(mockError);

            await expect(providerOneService.processCharge(paymentData))
                .rejects
                .toThrow(mockError);
        });
    });

    describe('getChargeDetails', () => {
        it('should return charge details', async () => {
            const chargeId = 'ch_123456';
            const mockResponse = {
                id: chargeId,
                status: 'succeeded',
                amount: 100,
                created: '2023-06-15T10:30:00Z'
            };

            client.get.mockResolvedValue(mockResponse);

            const result = await providerOneService.getChargeDetails(chargeId);

            expect(client.get).toHaveBeenCalledWith(`/charges/${chargeId}`);
            expect(result).toEqual(mockResponse);
        });

        it('should throw error when charge is not found', async () => {
            const chargeId = 'ch_nonexistent';
            const mockError = new Error('Charge not found');

            client.get.mockRejectedValue(mockError);

            await expect(providerOneService.getChargeDetails(chargeId))
                .rejects
                .toThrow(mockError);
        });
    });

    describe('processRefund', () => {
        it('should process refund successfully', async () => {
            const chargeId = 'ch_123456';
            const refundData = {
                amount: 100,
                reason: 'customer_request'
            };

            const mockResponse = {
                id: 'rf_123456',
                chargeId: chargeId,
                amount: 100,
                status: 'succeeded'
            };

            client.post.mockResolvedValue(mockResponse);

            const result = await providerOneService.processRefund(chargeId, refundData);

            expect(client.post).toHaveBeenCalledWith(`/refund/${chargeId}`, refundData);
            expect(result).toEqual(mockResponse);
        });

        it('should throw error when refund fails', async () => {
            const chargeId = 'ch_123456';
            const refundData = { amount: 200 };
            const mockError = new Error('Refund failed');

            client.post.mockRejectedValue(mockError);

            await expect(providerOneService.processRefund(chargeId, refundData))
                .rejects
                .toThrow(mockError);
        });
    });
});