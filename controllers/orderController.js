import Order from '../models/Order.js';


export const createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      totalPrice
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email');
  res.json(orders);
};


export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = req.body.status || order.status;
    await order.save();
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};
