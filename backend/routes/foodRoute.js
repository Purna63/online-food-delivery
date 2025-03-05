import express from "express";  //this all are correct
import { addFood,listFood,removeFood } from "../controllers/foodController.js";  //this all are correct
import multer from "multer";  //this all are correct

const foodRouter = express.Router();  //this all are correct

// Image Storage Engine

const storage = multer.diskStorage({
    destination: "uploads",  //this all are correct
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);  //this all are correct
  },
});

const upload = multer({ storage:storage });  //this all are correct

foodRouter.post("/add", upload.single("image"), addFood);  //this all are correct
foodRouter.get("/list",listFood)//this is correct
foodRouter.post("/remove",removeFood); //tis is correct

export default foodRouter;

// mongodb+srv://purnachandrapradhan:6370767143@cluster0.ig3qc.mongodb.net/?