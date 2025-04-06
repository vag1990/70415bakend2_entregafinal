import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";



export const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const user = await UserModel.create({ first_name, last_name, email, password });
    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, "coderSecret", { expiresIn: "1h" });

    res.json({ message: "Logged in", token });
  } catch (error) {
    res.status(500).json({ error: "Login error" });
  }
};

export const current = async (req, res) => {
  res.json({ user: req.user });
};
