import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Store user ID
  items: { type: Array, required: true }, // Ordered food items
  amount: { type: Number, required: true }, // Total price
  address: { type: Object, required: true }, // Delivery address
  status: { type: String, default: "Food Processing" }, // Order status
  date: { type: Date, default: Date.now }, // Optional custom order date
  payment: { type: Boolean, default: false }, // Payment success or not
}, { timestamps: true }); // ✅ Adds createdAt and updatedAt fields

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;

