import Product from "../models/Product.js";
import fs from "fs";
import path from "path";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, countInStock } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      countInStock,
      images: req.file.filename
    });

    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({
      message: "Error creating product",
      error: err.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, countInStock } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    if (req.file) {
      product.images = req.file.filename;
    }

    const updatedProduct = await product.save();

    res.json(updatedProduct);

  } catch (err) {
    res.status(500).json({
      message: "Error updating product",
      error: err.message
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Handle array of images
    if (Array.isArray(product.images)) {
      product.images.forEach((img) => {
        const imagePath = path.join(
          process.cwd(),
          "uploads",
          img
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    res.status(500).json({
      message: "Error deleting product",
      error: err.message
    });
  }
};

