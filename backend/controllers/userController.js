
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// Login User with phone
const loginUser = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await userModel.findOne({ phone });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Login failed" });
  }
};

// Create JWT
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User with phone
const registerUser = async (req, res) => {
  const { name, phone, password } = req.body;

  try {
    const exists = await userModel.findOne({ phone });
    if (exists) {
      return res.json({ success: false, message: "Phone already registered" });
    }

    // Validate phone number (basic length check)
    if (!validator.isMobilePhone(phone + "", "any")) {
      return res.json({ success: false, message: "Invalid phone number" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      phone,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Registration failed" });
  }
};

// Reset Password functionality
const resetPassword = async (req, res) => {
  const { phone, newPassword } = req.body;  // Receive phone number and new password

  try {
    const user = await userModel.findOne({ phone });  // Find user by phone number
    if (!user) {
      return res.json({ success: false, message: "Phone number not found!" });
    }

    // Hash the new password before saving (security reason)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;  // Update the password
    await user.save();  // Save the updated user info

    res.json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { loginUser, registerUser, resetPassword };
