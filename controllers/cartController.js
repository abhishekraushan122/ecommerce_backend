import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  // console.log("comiong")
  try {
    const { productId, qty } = req.body;
    const userId = req.user
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
  
    let cart = await Cart.findOne({ user: userId });
  
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, qty }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        i => i.product.toString() === productId
      );
  
      if (itemIndex > -1) {
        cart.items[itemIndex].qty += qty;
      } else {
        cart.items.push({ product: productId, qty });
      }
    }
  
    await cart.save();
    res.json(cart);
  
  } catch (error) {
    console.log(error);
    
  }
}
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate("items.product");

  res.json(cart || { items: [] });
};

export const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items = cart.items.filter(
    i => i.product.toString() !== req.params.id
  );

  await cart.save();
  res.json(cart);
};
