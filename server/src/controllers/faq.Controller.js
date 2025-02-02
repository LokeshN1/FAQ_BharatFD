import Faq from "../model/faq.model.js";
import translate from "google-translate-api-x"; // Google Translate API

// Function to translate text dynamically
const translateText = async (text, targetLang) => {
  if (!text || targetLang === "en") return text; // Return original if no text or English requested
  try {
    const translated = await translate(text, { to: targetLang });
    return translated.text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original text in case of error
  }
};

// GET all FAQs with optional translation
export const getAllFaqs = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const faqs = await Faq.find({});

    const translatedFaqs = await Promise.all(
      faqs.map(async (faq) => {
        const storedTranslation = faq.translations.find((t) => t.lang === lang);
        
        return {
          ...faq._doc,
          question: storedTranslation?.question || (await translateText(faq.question, lang)),
          answer: storedTranslation?.answer || (await translateText(faq.answer, lang)),
        };
      })
    );

    res.status(200).json(translatedFaqs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching FAQs", error: err.message });
  }
};

// GET single FAQ by ID with optional translation
export const getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    const lang = req.query.lang || "en";
    const storedTranslation = faq.translations.find((t) => t.lang === lang);

    const translatedFaq = {
      ...faq._doc,
      question: storedTranslation?.question || (await translateText(faq.question, lang)),
      answer: storedTranslation?.answer || (await translateText(faq.answer, lang)),
    };

    res.status(200).json(translatedFaq);
  } catch (err) {
    res.status(500).json({ message: "Error fetching FAQ", error: err.message });
  }
};

// POST Create new FAQ
export const createFaq = async (req, res) => {
  try {
    const { question, answer, translations } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    const newFaq = new Faq({ question, answer, translations });
    await newFaq.save();

    res.status(201).json({ message: "FAQ created successfully", faq: newFaq });
  } catch (err) {
    res.status(500).json({ message: "Error creating FAQ", error: err.message });
  }
};

// PUT Update FAQ by ID
export const updateFaq = async (req, res) => {
  try {
    const { question, answer, translations } = req.body;
    const faqId = req.params.id;

    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    const updatedFaq = await Faq.findByIdAndUpdate(
      faqId,
      { question, answer, translations },
      { new: true, runValidators: true }
    );

    if (!updatedFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json({ message: "FAQ updated successfully", faq: updatedFaq });
  } catch (err) {
    res.status(500).json({ message: "Error updating FAQ", error: err.message });
  }
};

// DELETE FAQ by ID
export const deleteFaq = async (req, res) => {
  try {
    const deletedFaq = await Faq.findByIdAndDelete(req.params.id);
    if (!deletedFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting FAQ", error: err.message });
  }
};
