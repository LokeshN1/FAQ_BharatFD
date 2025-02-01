import Faq from "../model/faq.model.js"; // Path to your model



// GET all FAQs
export const getAllFaqs = async (req, res) => {
  try {
    const lang = req.query.lang || 'en'; // Default to English if lang is not provided
    const faqs = await Faq.find({});
    const translatedFaqs = faqs.map(faq => {
      return {
        ...faq._doc,
        question: faq.translations.find(t => t.lang === lang)?.question || faq.question,
        answer: faq.translations.find(t => t.lang === lang)?.answer || faq.answer,
      };
    });
    res.status(200).json(translatedFaqs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching FAQs', error: err.message });
  }
};

// GET single FAQ by ID
export const getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    const lang = req.query.lang || 'en';
    const translatedFaq = {
      ...faq._doc,
      question: faq.translations.find(t => t.lang === lang)?.question || faq.question,
      answer: faq.translations.find(t => t.lang === lang)?.answer || faq.answer,
    };
    res.status(200).json(translatedFaq);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching FAQ', error: err.message });
  }
};

// POST Create new FAQ
export const createFaq = async (req, res) => {
  try {
    const { question, answer, translations } = req.body;
    const newFaq = new Faq({
      question,
      answer,
      translations,
    });
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (err) {
    res.status(500).json({ message: 'Error creating FAQ', error: err.message });
  }
};

// PUT Update FAQ by ID
export const updateFaq = async (req, res) => {
  try {
    const { question, answer, translations } = req.body;
    const updatedFaq = await Faq.findByIdAndUpdate(
      req.params.id,
      { question, answer, translations },
      { new: true }
    );
    if (!updatedFaq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.status(200).json(updatedFaq);
  } catch (err) {
    res.status(500).json({ message: 'Error updating FAQ', error: err.message });
  }
};

// DELETE FAQ by ID
export const deleteFaq = async (req, res) => {
  try {
    const deletedFaq = await Faq.findByIdAndDelete(req.params.id);
    if (!deletedFaq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting FAQ', error: err.message });
  }
};

