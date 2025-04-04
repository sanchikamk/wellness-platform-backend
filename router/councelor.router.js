import express from "express";
import { getCouncelors } from "../controller/users.controller.js";
import { checkUserAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/getCouncelors", checkUserAuth, getCouncelors);

export default router;
