import Stripe from 'stripe';
import Order from '../models/Order.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice ), 
      currency: 'vnd',
      metadata: { orderId: order._id.toString() }
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      status: 'paid',
      paymentInfo: {
        id: paymentIntent.id,
        status: paymentIntent.status
      }
    });
  }

  res.json({ received: true });
};
