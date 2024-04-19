import express from "express";
import { updateUser } from "../controllers/user.controllers.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "API is Working" });
});
router.put("/update:userId", verifyUser, updateUser);
export default router;
