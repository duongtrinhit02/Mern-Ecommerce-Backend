import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Hàm sinh JWT (kèm cả isAdmin)
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// format response user
const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  phone: user.phone,
  address: user.address,
  isAdmin: user.isAdmin,
});

// @desc    Đăng ký người dùng
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password });

  res.status(201).json({
    user: formatUser(user),
    token: generateToken(user._id, user.isAdmin), // ✅ thêm isAdmin
  });
};

// @desc    Đăng nhập người dùng
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    user: formatUser(user),
    token: generateToken(user._id, user.isAdmin), // ✅ thêm isAdmin
  });
};

// @desc    Lấy profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      user: formatUser(user),
      token: generateToken(user._id, user.isAdmin), // ✅ thêm isAdmin
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Cập nhật profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    user.avatar = req.body.avatar || user.avatar;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    const updatedUser = await user.save();

    res.json({
      user: formatUser(updatedUser),
      token: generateToken(updatedUser._id, updatedUser.isAdmin), // ✅ thêm isAdmin
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
