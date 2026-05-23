// ✅ Corrected paymentRoute.js
import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

// IMPORTANT
import orderModel from "../models/orderModel.js";

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



// CREATE ORDER
router.post("/create-order", async (req, res) => {
  try {

    const { amount } = req.body;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: "receipt_order_" + new Date().getTime(),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);

  } catch (error) {

    console.error("Payment order error:", error);

    res.status(500).json({
      message: "Failed to create payment order",
    });
  }
});



// WEBHOOK
router.post("/webhook", async (req, res) => {

  try {

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // CREATE SIGNATURE
    const shasum = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    // RAZORPAY SIGNATURE
    const signature = req.headers["x-razorpay-signature"];

    // VERIFY
    if (shasum !== signature) {

      console.log("Invalid webhook signature");

      return res.status(400).json({
        success: false,
      });
    }

    // PAYMENT DATA
    const payment = req.body.payload.payment.entity;

    // IMPORTANT
    const razorpayOrderId = payment.order_id;

    console.log("Webhook Payment Success:", razorpayOrderId);

    // UPDATE ORDER
    const updatedOrder = await orderModel.findOneAndUpdate(
      { razorpayOrderId },

      {
        payment: true,
        status: "Pending",
      },

      { new: true }
    );

    console.log("UPDATED ORDER:", updatedOrder);

    res.json({
      success: true,
    });

  } catch (error) {

    console.log("Webhook Error:", error);

    res.status(500).json({
      success: false,
    });
  }
});



export default router;
