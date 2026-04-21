import foodModel from "../models/foodModel.js";
import fs from "fs";

//add food item

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
    // NEW UPDATE START
    shopName: req.body.shopName,
    isAvailable: req.body.isAvailable === "true",
    shopStatus: req.body.shopStatus,
    // NEW UPDATE END
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// All food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// NEW UPDATE FOOD STATUS
const updateFoodStatus = async (req, res) => {
  try {
    await foodModel.findByIdAndUpdate(req.body.id, {
      shopName: req.body.shopName,
      isAvailable: req.body.isAvailable,
      shopStatus: req.body.shopStatus,
    });

    const io = req.app.get("io");
    io.emit("foodUpdated");

    res.json({ success: true, message: "Updated Successfully" });
  } catch (error) {
    res.json({ success: false, message: "Update Failed" });
  }
};

export { addFood, listFood, removeFood, updateFoodStatus };
