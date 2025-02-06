import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import faqRoutes from "./routes/faq.Routes.js";
import {connectDB} from "./lib/db.js";
import adminRoutes from "./routes/admin.routes.js"; // Correct import
import cookieParser from "cookie-parser"; // Import cookie-parser
import {errorHandler} from "./middleware/error.middleware.js";
import {notFoundMiddleware} from "./middleware/notFound.middleware.js";
dotenv.config({path: "./src/.env"});

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cookieParser()); // Add this before any route handlers
app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
);

// Routes
app.use("/api", faqRoutes);
app.use("/api/admin", adminRoutes);

// Catch-all for undefined routes
app.use(notFoundMiddleware);

// Error handling middleware (last middleware)
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

export default app;
