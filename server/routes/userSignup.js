import express from "express";
import bcrypt from "bcrypt";
import { generateToken, getUserByEmail } from "../controllers/user.js";
import { User } from "../models/user.js";

const router = express.Router();

// Signup
router.post("/", async (req, res) => {
  try {
    // Check if the user already exists
    console.log("Request Body:", req.body);
    const existingUser = await getUserByEmail(req);
    if (existingUser) {
      return res.status(400).json({ error: "User Already Exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user and save to the database
    const user = await new User({
      ...req.body,
      password: hashedPassword,
    }).save();

    // Generate AuthToken and send the response
    const authToken = generateToken(user._id);
    res.status(201).json({
      message: "User Registered Successfully",
      authToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const userSignup = router;
