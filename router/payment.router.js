import express from 'express';
import { createPaymentIntent, handleStripeWebhook } from '../controller/payment.controller.js';

const router = express.Router();

// Create Payment Intent
router.post('/create-payment-intent', createPaymentIntent);

// Stripe Webhook (note: raw body parser used here in server.js!)
router.post('/webhook', handleStripeWebhook);

export default router;
