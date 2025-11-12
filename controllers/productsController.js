import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
  try {
    const { search, sort, category } = req.query;

    // Điều kiện tìm kiếm
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" }; // tìm theo tên, không phân biệt hoa thường
    }

    if (category) {
      query.category = category; // lọc theo category
    }

    // Base query
    let productsQuery = Product.find(query);

    // Sắp xếp theo giá
    if (sort === "asc") {
      productsQuery = productsQuery.sort({ price: 1 }); // tăng dần
    } else if (sort === "desc") {
      productsQuery = productsQuery.sort({ price: -1 }); // giảm dần
    }

    const products = await productsQuery.exec();

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    // req.body.images phải là mảng URL
    const { name, description, price, images, category, countInStock, isFeatured } = req.body;

    const product = new Product({
      name,
      description,
      price,
      images,           // lưu mảng ảnh
      category,
      countInStock,
      isFeatured,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Invalid data' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: 'Update failed' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Not found' });
    res.json({ msg: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Delete failed' });
  }
};
export const getCategories = (req, res) => {
  try {
    const categories = Product.schema.path('category').enumValues;
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: 'Không lấy được categories' });
  }
};
