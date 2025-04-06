import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" }
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
