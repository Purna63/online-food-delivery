

import express from "express";
import { loginUser, registerUser, resetPassword, saveAddress, getAddress } from "../controllers/userController.js"; // Added resetPassword
import authMiddleware from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/reset-password", resetPassword); // Added the route for reset password
userRouter.post("/save-address", authMiddleware, saveAddress);
userRouter.get("/get-address", authMiddleware, getAddress);

export default userRouter;
