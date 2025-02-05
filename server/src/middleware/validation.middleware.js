// middleware/validateFaq.middleware.js
export const validateFaqMiddleware = (req, res, next) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ message: "Question and answer are required" });
  }
  

  next(); // If validation passes, move to the next middleware or route handler
};
