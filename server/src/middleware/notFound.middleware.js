//  middleware/notFound.middleware.js
export const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error); // Pass the error to the error-handling middleware
};

