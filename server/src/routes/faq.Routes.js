import express from "express";
import {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../controllers/faq.Controller.js";
import {verifyAdmin} from "../middleware/auth.middleware.js";
import {validateFaqMiddleware} from "../middleware/validation.middleware.js";

const router = express.Router();

router.get("/faqs", getAllFaqs);
router.get("/faqs/:id", getFaqById);
router.post("/faqs", verifyAdmin, validateFaqMiddleware, createFaq);
router.put("/faqs/:id", verifyAdmin, validateFaqMiddleware, updateFaq);
router.delete("/faqs/:id", verifyAdmin, deleteFaq);

export default router;
