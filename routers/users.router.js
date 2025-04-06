import express from "express";
import { registerUser, loginUser, getUserById } from "../controllers/users.controller.js";
import { checkUserAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/:id", checkUserAuth, getUserById);

export default router;
