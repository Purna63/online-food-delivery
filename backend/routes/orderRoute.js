import express from "express";
import orderModel from "../models/orderModel.js";
import authMiddleware from "../middleware/auth.js";
import { calculateDistance } from "../utils/distance.js";
import userModel from "../models/userModel.js";
import axios from "axios";

const router = express.Router();

// PLACE ORDER
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log(req.body);

    const userId = req.userId;

    const {
      items,
      deliveryInfo,
      payment,
      deliveryFee,
      amount,
      status, // NEW
      razorpayOrderId,
    } = req.body;

    // RESTAURANT LOCATION
    const RESTAURANT_LAT = 20.302559;
    const RESTAURANT_LNG = 86.404263;

    const userLat = parseFloat(deliveryInfo.lat);
    const userLng = parseFloat(deliveryInfo.lng);

    // IMPORTANT FIX
    if (
      userLat === undefined ||
      userLng === undefined ||
      isNaN(userLat) ||
      isNaN(userLng)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select location",
      });
    }

    // DISTANCE
    const distance = calculateDistance(
      RESTAURANT_LAT,
      RESTAURANT_LNG,
      userLat,
      userLng,
    );

    // MAX DISTANCE
    if (distance > 8) {
      return res.status(400).json({
        success: false,
        message: "Delivery unavailable",
      });
    }

    // ORDER ITEMS
    const orderDetails = items.map((item) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      shopName: item.shopName,
    }));

    const user = await userModel.findById(userId);

    // SAVE ORDER
    const order = new orderModel({
      userId,

      items: orderDetails,

      amount: amount,

      deliveryCharge: deliveryFee,

      address: deliveryInfo,

      payment,

      // IMPORTANT
      // frontend status will come here
      status: status || "Pending",
      razorpayOrderId: razorpayOrderId,

      distance,

      name: user?.name || deliveryInfo.firstName || "Customer",

      phone: user?.phone || deliveryInfo.phone || "",
    });

    await order.save();

    console.log("ORDER SAVED");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.log("ORDER ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
});

// ADMIN GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.log(err);

    res.status(500).send("Failed to fetch orders");
  }
});

// USER GET ORDERS
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
    });
  }
});

// NEW ROUTE
// PAYMENT SUCCESS UPDATE
router.patch("/payment-success/:id", async (req, res) => {
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      {
        payment: true,
        status: "Pending",
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // SEND TELEGRAM NOTIFICATION
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `
✅ NEW PAID ORDER

👤 ${updatedOrder.name}

📞 ${updatedOrder.phone}

💰 Amount : ₹${updatedOrder.amount}

🚚 Delivery : ₹${updatedOrder.deliveryCharge}

📌 Status : ${updatedOrder.status}
`,
      }
    );

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Payment update failed",
    });
  }
});

// UPDATE STATUS
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!updatedOrder) {
      return res.status(404).send("Order not found");
    }

    const io = req.app.get("io");

    io.emit("orderStatusUpdated", updatedOrder);

    res.json({
      message: "Order updated",
      order: updatedOrder,
    });
  } catch (err) {
    console.log(err);

    res.status(500).send("Failed to update");
  }
});

// DELETE ORDER
router.delete("/:id", async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.params.id);

    res.status(200).send("Order removed");
  } catch (err) {
    console.log(err);

    res.status(500).send("Delete failed");
  }
});

export default router;
