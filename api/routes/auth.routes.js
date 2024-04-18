import express from "express";
import { google, signIn, signup } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/sign-up", signup);
router.post("/sign-in", signIn);
router.post("/google", google);
export default router;
