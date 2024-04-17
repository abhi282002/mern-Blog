import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
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

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || username == "" || password == "") {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email }).select("-password");
    if (!validUser) {
      next(errorHandler(404, "User not found"));
    }
    console.log(validUser);
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid Password"));
    }
    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(validUser);
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};
