const client = require('../../src/clients/client');
const providerTwoService = require('../../src/services/providerTwoService');

jest.mock('../../src/clients/client');

describe('ProviderTwoService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('processTransaction', () => {
        it('should process a transaction successfully', async () => {
            const transactionData = {
                amount: 100,
                currency: 'USD',
                paymentType: 'card',
                card: {
                    number: '4111111111111111',
                    expiryMonth: 12,
                    expiryYear: 2025,
                    cvv: '123'
                }
            };

            const mockResponse = {
                id: 'tx_123456',
                status: 'approved',
                amount: 100
            };

            client.post.mockResolvedValue(mockResponse);

            const result = await providerTwoService.processTransaction(transactionData);

            expect(client.post).toHaveBeenCalledWith('/transactions', transactionData);
            expect(result).toEqual(mockResponse);
        });

        it('should throw error when transaction is rejected', async () => {
            const transactionData = {
                amount: 100,
                currency: 'USD',
                paymentType: 'card',
                card: {
                    number: '4111111111111111',
                    expiryMonth: 12,
                    expiryYear: 2025,
                    cvv: '999'
                }
            };

            const mockError = new Error('Failed to process transaction');
            client.post.mockRejectedValue(mockError);

            await expect(providerTwoService.processTransaction(transactionData))
                .rejects
                .toThrow(mockError);
        });
    });

    describe('getTransactionDetails', () => {
        it('should return transaction details', async () => {
            const transactionId = 'tx_123456';
            const mockResponse = {
                id: transactionId,
                status: 'approved',
                amount: 100,
                timestamp: '2023-06-15T10:30:00Z'
            };

            client.get.mockResolvedValue(mockResponse);

            const result = await providerTwoService.getTransactionDetails(transactionId);

            expect(client.get).toHaveBeenCalledWith(`/transactions/${transactionId}`);
            expect(result).toEqual(mockResponse);
        });

        it('should throw error when transaction is not found', async () => {
            const transactionId = 'tx_nonexistent';
            const mockError = new Error('Transaction not found');

            client.get.mockRejectedValue(mockError);

            await expect(providerTwoService.getTransactionDetails(transactionId))
                .rejects
                .toThrow(mockError);
        });
    });

    describe('processVoid', () => {
        it('should process void successfully', async () => {
            const transactionId = 'tx_123456';
            const voidData = {
                reason: 'customer_request'
            };

            const mockResponse = {
                id: 'void_123456',
                transactionId: transactionId,
                status: 'voided'
            };

            client.post.mockResolvedValue(mockResponse);

            const result = await providerTwoService.processVoid(transactionId, voidData);

            expect(client.post).toHaveBeenCalledWith(`/void/${transactionId}`, voidData);
            expect(result).toEqual(mockResponse);
        });

        it('should throw error when void fails', async () => {
            const transactionId = 'tx_123456';
            const voidData = { reason: 'fraud' };
            const mockError = new Error('Cannot void settled transaction');

            client.post.mockRejectedValue(mockError);

            await expect(providerTwoService.processVoid(transactionId, voidData))
                .rejects
                .toThrow(mockError);
        });
    });
});