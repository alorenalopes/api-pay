const express = require('express');
const PaymentController = require('../controllers/paymentController');

class PaymentRouter {
    constructor() {
        this.router = express.Router();
        this.controller = new PaymentController();

        this.router.post('/payments', this.controller.processPayment.bind(this.controller));
        this.router.get('/payments/:id', this.controller.getPaymentDetails.bind(this.controller));
        this.router.post('/payments/:id/refund', this.controller.processRefund.bind(this.controller));
    }
}

const router = new PaymentRouter();
module.exports = router.router;