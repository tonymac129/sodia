import express from "express";
import { login } from "../controllers/appController.js";

const appRouter = express.Router();

appRouter.post("/login", login);

export default appRouter;
