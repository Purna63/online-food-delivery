import express from "express";
import orderModel from "../models/orderModel.js";
import authMiddleware from "../middleware/auth.js";
// NEW IMPORT
import { calculateDistance } from "../utils/distance.js";
import userModel from "../models/userModel.js";

const router = express.Router();

// ✅ Place Order Route
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItems, food_list, deliveryInfo, amount, payment } = req.body;

    // RESTAURANT LOCATION (FIXED)
    const RESTAURANT_LAT = 20.302559;
    const RESTAURANT_LNG = 86.404263;

    const userLat = parseFloat(deliveryInfo.lat);
    const userLng = parseFloat(deliveryInfo.lng);

    if (!userLat || !userLng) {
      return res.status(400).json({
        error: "Please select delivery location on map.",
      });
    }

    // CALCULATE DISTANCE
    const distance = calculateDistance(
      RESTAURANT_LAT,
      RESTAURANT_LNG,
      userLat,
      userLng,
    );

    // ADD THIS
    if (distance > 8) {
      return res.status(400).json({
        error: "Sorry, we do not deliver to this location.",
      });
    }

    // DELIVERY CHARGE RULE
    let deliveryCharge = 0;

    if (distance <= 2) deliveryCharge = 10;
    else if (distance <= 4) deliveryCharge = 20;
    else if (distance <= 6) deliveryCharge = 30;
    else deliveryCharge = 40;

    const orderDetails = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        name: item.name,
        category: item.category, // Include category
        quantity: cartItems[item._id],
      }));

    let foodTotal = 0;
    orderDetails.forEach((item) => {
      const product = food_list.find((f) => f.name === item.name);
      if (product) {
        foodTotal += product.price * item.quantity;
      }
    });
    const totalAmount = foodTotal + deliveryCharge;
    const user = await userModel.findById(userId);

    const order = new orderModel({
      userId,
      items: orderDetails,
      amount: totalAmount,
      address: deliveryInfo,
      payment,
      status: "Pending",
      // NEW DATA SAVE
      deliveryCharge,
      distance,
       name: user?.name || deliveryInfo.firstName || "Customer",
      phone: user?.phone || deliveryInfo.phone || "",
    });

    await order.save();

    res.status(201).json({
      message: "Order placed",
      distance,
      deliveryCharge,
      totalAmount,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).send("Failed to store order");
  }
});

// ✅ Admin - Get ALL orders
router.get("/", async (req, res) => {
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
