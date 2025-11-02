import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import router from "./routes/homeRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5001;

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  message: "Too many requests! Please wait and try again later.",
});

app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
}
app.use("/api", apiLimiter);
app.use("/api", router);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Port has started");
  });
});
