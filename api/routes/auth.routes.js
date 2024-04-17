import express from "express";
import { signIn, signup } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/sign-up", signup);
router.post("/sign-in", signIn);
export default router;
