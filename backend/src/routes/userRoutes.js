import express from "express";
import { createUser, getUser } from "../controllers/usersController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.get("/:id", getUser);

export default userRouter;
