import User from '../models/User.js';
import Product from '../models/Product.js';

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    const populatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(populatedUser.cart);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi thêm vào giỏ hàng', error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error: err.message });
  }
};


export const updateQty = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = quantity;
    } else {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    await user.save();

    const populatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(populatedUser.cart);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật số lượng', error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();

    const populatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json(populatedUser.cart);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = [];
    await user.save();

    res.json([]); 
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi clear giỏ hàng', error: err.message });
  }
};
