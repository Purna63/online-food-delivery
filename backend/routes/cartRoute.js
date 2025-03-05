import express from "express"//this is correct
import { addToCart,removeFromCart,getCart } from "../controllers/cartController.js"//this is correct
import authMiddleware from "../middleware/auth.js";//this is correct

const cartRouter = express.Router();//correct

cartRouter.post("/add",authMiddleware,addToCart)//correct
cartRouter.post("/remove",authMiddleware,removeFromCart)//correct
cartRouter.post("/get",authMiddleware,getCart)//correct

export default cartRouter;