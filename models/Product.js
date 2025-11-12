import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    category: {
      type: String,
      required: true,
      enum: ["Điện thoại", "Laptop",  "Phụ kiện","Đồng hồ", "Khác"], 
    },
    countInStock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
