import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  images: [String],
  countInStock: { type: Number, default: 0 },
  views: {
    type: Number,
    default: 0
  },
  sold: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
