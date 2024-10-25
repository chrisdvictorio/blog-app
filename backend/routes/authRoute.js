import express from "express";

import authController from "../controllers/authController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", protectRoute, authController.getUser);

export default router;