import express from "express";

import postController from "../controllers/postController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create", protectRoute, postController.createPost);
router.post("/like/:id", protectRoute, postController.likePost);
router.post("/save/:id", protectRoute, postController.savePost);
router.get("/", postController.getAllPosts);
router.get("/:id", protectRoute, postController.getSinglePost);
router.get("/category/:category", postController.getPostsByCategory);
router.patch("/:id/edit", protectRoute, postController.editPost);
router.delete("/:id/delete", protectRoute, postController.deletePost);

export default router;
