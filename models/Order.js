import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String }
    }
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered'],
    default: 'pending'
  },
  paymentInfo: {
    id: String,     // Stripe paymentIntent id
    status: String  // Stripe status
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
