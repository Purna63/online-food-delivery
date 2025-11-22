import express from "express";
import orderModel from "../models/orderModel.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ✅ Place Order Route
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItems, food_list, deliveryInfo, amount, payment } = req.body;

    const orderDetails = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        name: item.name,
        category: item.category, // Include category
        quantity: cartItems[item._id],
      }));

    const order = new orderModel({
      userId,
      items: orderDetails,
      amount,
      address: deliveryInfo,
      payment,
      status: "Pending",
    });

    await order.save();

    res.status(201).send("Order placed");
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).send("Failed to store order");
  }
});

// ✅ Admin - Get ALL orders
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).send("Failed to fetch orders");
  }
});


// ✅ USER - GET ONLY USER'S OWN ORDERS  (Frontend user uses this)
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).send("Failed to fetch user orders");
  }
});



// ✅ Update Order Status & Emit via Socket.IO
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).send("Order not found");

    // Emit to all clients using socket.io
    const io = req.app.get("io"); // 👈 Get socket instance
    io.emit("orderStatusUpdated", updatedOrder); // 👈 Emit event with updated order

    res.json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    console.error("Failed to update status:", err);
    res.status(500).send("Failed to update status");
  }
});

// ✅ Delete Order by ID
router.delete("/:id", async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.params.id);
    res.status(200).send("Order removed successfully");
  } catch (err) {
    console.error("Failed to delete order:", err);
    res.status(500).send("Error deleting order");
  }
});

export default router;
