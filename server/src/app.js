import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import faqRoutes from "./routes/faq.Routes.js";
import { connectDB } from "./lib/db.js";

dotenv.config({ path: "./src/.env" });

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api", faqRoutes);

app.get("/", (req, res) => {
  res.send("Hello from the FAQ API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

