import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  signOut,
  updateUser,
} from "../controllers/user.controllers.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "API is Working" });
});
router.put("/update/:userId", verifyUser, updateUser);
router.delete("/delete/:userId", verifyUser, deleteUser);
router.post("/signout", verifyUser, signOut);
router.get("/getUsers", verifyUser, getUsers);
router.get("/:userId", getUser);
export default router;
