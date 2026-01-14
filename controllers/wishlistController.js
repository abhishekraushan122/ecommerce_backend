import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

/**
 * ADD TO WISHLIST
 */
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = new Wishlist({
      user: userId,
      products: [productId]
    });
  } else {
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: "Already in wishlist" });
    }
    wishlist.products.push(productId);
  }

  await wishlist.save();
  res.json(wishlist);
};

/**
 * GET WISHLIST
 */
export const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate("products");

  res.json(wishlist || { products: [] });
};

/**
 * REMOVE FROM WISHLIST
 */
export const removeFromWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    return res.status(404).json({ message: "Wishlist not found" });
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== req.params.id
  );

  await wishlist.save();
  res.json(wishlist);
};
