// paymentRoute.js

import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import axios from "axios";

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

// CREATE PAYMENT LINK FOR APP

router.post("/create-payment-link", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const { amount, name, phone } = req.body;

    const paymentLink = await razorpay.paymentLink.create({
      amount: amount,
      currency: "INR",

      description: "Food Delivery Order",

      customer: {
        name: name || "Customer",
        contact: phone || "",
      },

      notify: {
        sms: false,
        email: false,
      },

      reminder_enable: false,
    });

    res.json({
      success: true,
      paymentLink: paymentLink.short_url,
      paymentLinkId: paymentLink.id,
    });
  } catch (error) {
  console.log("PAYMENT LINK ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
    error,
  });
}
});



// WEBHOOK
router.post("/webhook", async (req, res) => {
  try {

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // RAZORPAY SIGNATURE
    const signature = req.headers["x-razorpay-signature"];

    // CREATE SIGNATURE
    const shasum = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    // VERIFY SIGNATURE
    if (shasum !== signature) {

      console.log("Invalid webhook signature");

      return res.status(400).json({
        success: false,
      });
    }

    // CONVERT RAW BODY
    const body = JSON.parse(req.body.toString());

    // PAYMENT DATA
    const payment = body.payload.payment.entity;

    // RAZORPAY ORDER ID
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

if (updatedOrder) {
  await axios.post(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: `
✅ PAYMENT SUCCESS

🍔 NEW ORDER RECEIVED

👤 Customer: ${updatedOrder.name}
📞 Phone: ${updatedOrder.phone}

💰 Amount: ₹${updatedOrder.amount}
🚚 Delivery Fee: ₹${updatedOrder.deliveryCharge}

📌 Status: ${updatedOrder.status}
`,
    }
  );
}

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
