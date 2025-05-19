import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://purnachandrap:9777834155@cluster0.o4p3k.mongodb.net/food-delivery"
    )
    .then(() => console.log("DB Connected"));
};


