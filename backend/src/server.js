import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import router from "./routes/homeRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();

const app = express();

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  message: "Too many requests! Please wait and try again later.",
});

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/api", apiLimiter);
app.use("/api", router);

connectDB().then(() => {
  app.listen(5001, () => {
    console.log("Port has started");
  });
});
