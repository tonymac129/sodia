import express from "express";
import { getAllPosts, createPost, getPost, deletePost, updatePost } from "../controllers/postsController.js";

const postRouter = express.Router();

postRouter.get("/", getAllPosts);
postRouter.get("/:postid", getPost);
postRouter.delete("/:postid", deletePost);
postRouter.put("/:postid", updatePost);
postRouter.post("/", createPost);

export default postRouter;
