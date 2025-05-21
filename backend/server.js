import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import orderRouter from "./routes/orderRoute.js";
import storeStatusRoute from './routes/storeStatusRoute.js';
import "dotenv/config";

const app = express();
const port = process.env.PORT || 4000;

// ✅ Local frontend & admin panel URLs
const allowedOrigins = [
  "http://localhost:5173", // frontend
  "http://localhost:5174", // admin
  "https://online-food-delivery-frontend-8i06.onrender.com",
  "https://online-food-delivery-admin-spq5.onrender.com"
];

// Create HTTP server
const server = http.createServer(app);

// ✅ CORS setup for Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

// ✅ CORS setup for Express routes
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// DB connection
connectDB();

// Inject io into app for use in routes
app.set("io", io);

// API routes
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/order", orderRouter);
app.use('/api/store-status', storeStatusRoute);

// Root test route
app.get("/", (req, res) => {
  res.send("API working");
});

// Socket.IO connection setup
io.on("connection", (socket) => {
  socket.on("disconnect", () => {});
});

// Start server
server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
