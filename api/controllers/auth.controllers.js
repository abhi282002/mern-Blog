import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
export const signup = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.json({
      message: "SignUp Successful",
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
