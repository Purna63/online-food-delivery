import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },

    // NEW UPDATE START
  shopName: { type: String, default: "Rahama Market" },
  isAvailable: { type: Boolean, default: true }, // food available
  shopStatus: { type: String, default: "open" }, // open / closed
  // NEW UPDATE END
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
export default foodModel;
