// middleware/error.middleware.js
export const errorHandler = (err, req, res, next) => {
  
  const statusCode = err.status || 500;   // Default to 500 for unexpected errors
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack trace in production
  });
};
