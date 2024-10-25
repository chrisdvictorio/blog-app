import express from "express";

import userController from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, userController.getUserProfile);
router.post("/follow/:id", protectRoute, userController.followUser);
router.delete("/profile/:username/followers/remove/:id", protectRoute, userController.removeFollower);
router.patch("/update", protectRoute, userController.updateProfile);

export default router;