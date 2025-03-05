// // import orderModel from "../models/orderModel.js";
// // import userModel from "../models/userModel.js";
// // import Razorpay from "razorpay";

// // // Initialize Razorpay
// // const razorpay = new Razorpay({
// //   key_id: process.env.RAZORPAY_KEY_ID,
// //   key_secret: process.env.RAZORPAY_SECRET_KEY,
// // });

// // const placeOrder = async (req, res) => {
// //   const frontend_url = "http://localhost:5173"; // frontend URL for success/cancel
// //   try {
// //     // Create a new order in the database
// //     const newOrder = new orderModel({
// //       userId: req.body.userId,
// //       items: req.body.items,
// //       amount: req.body.amount,
// //       address: req.body.address,
// //     });
// //     await newOrder.save();
// //     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

// //     // Calculate line items
// //     const line_items = req.body.items.map((item) => ({
// //       price_data: {
// //         currency: "inr",
// //         product_data: {
// //           name: item.name,
// //         },
// //         unit_amount: item.price * 100, // Amount in paise (100 paise = 1 INR)
// //       },
// //       quantity: item.quantity,
// //     }));

// //     // Adding delivery charge
// //     line_items.push({
// //       price_data: {
// //         currency: "inr",
// //         product_data: {
// //           name: "Delivery Charges",
// //         },
// //         unit_amount: 2 * 100, // Delivery charge in paise
// //       },
// //       quantity: 1,
// //     });

// //     // Calculate total amount
// //     const totalAmount = line_items.reduce(
// //       (total, item) => total + item.price_data.unit_amount * item.quantity,
// //       0
// //     );

// //     // Create Razorpay order
// //     const orderOptions = {
// //       amount: totalAmount, // Total amount in paise
// //       currency: "INR",
// //       receipt: `order_rcptid_${newOrder._id}`,
// //     };

// //     const session = await razorpay.orders.create(orderOptions);

// //     // Send response to the frontend with Razorpay order ID and URLs
// //     res.json({
// //       success: true,
// //       razorpay_order_id: session.id,
// //       amount: totalAmount,
// //       currency: "INR",
// //       success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
// //       cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
// //     });
// //   } catch (error) {
// //     console.log("Error processing the order:", error); // Log error details
// //     res.json({
// //       success: false,
// //       message: "Error processing the order. Please try again.",
// //     });
// //   }
// // };

// // // user order for frontend
// // const userOrders = async (req,res)=>{
// //   try {
// //     const orders = await orderModel.find({userId:req.body.userId})
// //     res.json({success:true,data:orders})
// //   } catch (error) {
// //     console.log(error);
// //     res.json({success:false,message:"Error"})
// //   }
// // }

// // export { placeOrder,userOrders };

// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Razorpay from "razorpay";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET_KEY,
// });

// const placeOrder = async (req, res) => {
//   const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";
//   try {
//     // Create a new order in the database
//     const newOrder = new orderModel({
//       userId: req.body.userId,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//     });
//     await newOrder.save();
//     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//     // Calculate line items
//     const line_items = req.body.items.map((item) => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item.name,
//         },
//         unit_amount: item.price * 100 *80,
//       },
//       quantity: item.quantity,
//     }));

//     // Adding delivery charge
//     const deliveryCharge = 2 * 100; // Delivery charge in paise
//     line_items.push({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: "Delivery Charges",
//         },
//         unit_amount: deliveryCharge,
//       },
//       quantity: 1,
//     });

//     // Calculate total amount
//     const totalAmount = line_items.reduce(
//       (total, item) => total + item.price_data.unit_amount * item.quantity,
//       0
//     );

//     // Create Razorpay order
//     const orderOptions = {
//       amount: totalAmount,
//       currency: "INR",
//       receipt: `order_rcptid_${newOrder._id}`,
//     };

//     const razorpayOrder = await razorpay.orders.create(orderOptions);

//     // Send response to the frontend with Razorpay order ID and URLs
//     res.json({
//       success: true,
//       razorpay_order_id: razorpayOrder.id,
//       amount: totalAmount,
//       currency: "INR",
//       success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//       cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
//     });
//   } catch (error) {
//     console.error("Error processing the order:", error.response || error.message || error);
//     res.json({
//       success: false,
//       message: "Error processing the order. Please try again.",
//     });
//   }
// };

// const userOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({ userId: req.body.userId });
//     res.json({ success: true, data: orders });
//   } catch (error) {
//     console.error("Error fetching user orders:", error.message || error);
//     res.json({ success: false, message: "Error fetching orders." });
//   }
// };

// export { placeOrder, userOrders };

// // Import required modules
// // import dotenv from "dotenv"; // Ensure environment variables are loaded from .env
// // dotenv.config();

// // import orderModel from "../models/orderModel.js";
// // import userModel from "../models/userModel.js";
// // import Razorpay from "razorpay";

// // // Initialize Razorpay with environment variables
// // const razorpay = new Razorpay({
// //   key_id: process.env.RAZORPAY_KEY_ID,
// //   key_secret: process.env.RAZORPAY_SECRET_KEY,
// // });

// // const placeOrder = async (req, res) => {
// //   const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";
// //   try {
// //     // 1. Create a new order in the database
// //     const newOrder = new orderModel({
// //       userId: req.body.userId,
// //       items: req.body.items,
// //       amount: req.body.amount,
// //       address: req.body.address,
// //     });
// //     await newOrder.save();
// //     console.log("Order saved successfully:", newOrder); // Log order creation

// //     // 2. Prepare line items for the order
// //     const line_items = req.body.items.map((item) => ({
// //       price_data: {
// //         currency: "inr",
// //         product_data: {
// //           name: item.name,
// //         },
// //         unit_amount: item.price * 100, // Amount in paise
// //       },
// //       quantity: item.quantity,
// //     }));

// //     // 3. Adding delivery charge (ensure it's in paise)
// //     const deliveryCharge = 2 * 100; // Delivery charge in paise
// //     line_items.push({
// //       price_data: {
// //         currency: "inr",
// //         product_data: {
// //           name: "Delivery Charges",
// //         },
// //         unit_amount: deliveryCharge,
// //       },
// //       quantity: 1,
// //     });

// //     // 4. Calculate total amount (ensure it's in paise)
// //     const totalAmount = line_items.reduce(
// //       (total, item) => total + item.price_data.unit_amount * item.quantity,
// //       0
// //     );

// //     console.log("Total amount in paise:", totalAmount); // Log the total amount calculation

// //     // 5. Create Razorpay order
// //     const orderOptions = {
// //       amount: totalAmount, // Total amount in paise
// //       currency: "INR",
// //       receipt: `order_rcptid_${newOrder._id}`,
// //     };

// //     // 6. Creating Razorpay order and handling potential errors
// //     const razorpayOrder = await razorpay.orders.create(orderOptions);
// //     console.log("Razorpay order created:", razorpayOrder); // Log Razorpay order creation

// //     if (!razorpayOrder || !razorpayOrder.id) {
// //       throw new Error("Failed to create Razorpay order.");
// //     }

// //     // 7. Send response to the frontend with Razorpay order ID and URLs
// //     res.json({
// //       success: true,
// //       razorpay_order_id: razorpayOrder.id,
// //       amount: totalAmount,
// //       currency: "INR",
// //       success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
// //       cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
// //     });
// //   } catch (error) {
// //     console.error("Error processing the order:", error.message || error); // Log error message
// //     res.json({
// //       success: false,
// //       message: "Error processing the order. Please try again.",
// //     });
// //   }
// // };

// // const userOrders = async (req, res) => {
// //   try {
// //     const orders = await orderModel.find({ userId: req.body.userId });
// //     res.json({ success: true, data: orders });
// //   } catch (error) {
// //     console.error("Error fetching user orders:", error.message || error);
// //     res.json({ success: false, message: "Error fetching orders." });
// //   }
// // };

// // export { placeOrder, userOrders };

