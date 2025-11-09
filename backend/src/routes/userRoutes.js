import express from "express";
import { createUser, getUser, deleteUser, editUser } from "../controllers/usersController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.get("/:id", getUser);
userRouter.put("/:id", editUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
