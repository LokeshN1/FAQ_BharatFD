import express from 'express';
import { getAllFaqs, getFaqById, createFaq, updateFaq, deleteFaq } from '../controllers/faq.Controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all FAQs
router.get('/faqs', getAllFaqs);

// Get a single FAQ by ID
router.get('/faqs/:id', getFaqById);

// Create a new FAQ
router.post('/faqs', verifyAdmin, createFaq);

// Update an existing FAQ by ID
router.put('/faqs/:id', verifyAdmin, updateFaq);

// Delete a FAQ by ID
router.delete('/faqs/:id', verifyAdmin, deleteFaq);

export default router;

