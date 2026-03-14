import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  street: { type: String, default: "" },
  landmark: { type: String, default: "" },
  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
