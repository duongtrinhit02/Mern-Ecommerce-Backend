import express from 'express';
import { createPayment, stripeWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-payment', protect, createPayment);

router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
