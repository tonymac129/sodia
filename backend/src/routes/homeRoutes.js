import express from "express";
import { getAllPosts, createPost, getPost, deletePost,updatePost } from "../controllers/postsController.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:postid", getPost);
router.delete("/:postid", deletePost);
router.put("/:postid", updatePost);
router.post("/", createPost);

export default router;
