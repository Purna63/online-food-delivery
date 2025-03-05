import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js"; //this is correct
import foodRouter from "./routes/foodRoute.js"; //this is correct
import userRouter from "./routes/userRoute.js"; //This is correct
import "dotenv/config"; //this is correct
import cartRouter from "./routes/cartRoute.js"; //this is correct
// import orderRouter from "./routes/orderRoute.js";

//app config
const app = express();
const port = 4000;

//middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter); //this is correct
app.use("/images", express.static("uploads")); //this is correct
app.use("/api/user", userRouter); //This is correct
app.use("/api/cart", cartRouter); //this is correct
// app.use("/api/order",orderRouter)

app.get("/", (req, res) => {
  res.send("API working");
});
app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});

// mongodb+srv://purnachandrap:9777834155@cluster0.o4p3k.mongodb.net/?
