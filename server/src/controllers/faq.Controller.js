import Faq from "../model/faq.model.js";
import {redisClient} from "../lib/redis.js";
import {translateUsingGoogleAPI} from "../lib/googleTranslate.js";

// Get cached translation from Redis
const getCachedTranslation = async (key) => {
  try {
    if (!redisClient.isReady) throw new Error("Redis is not connected");
    const cachedValue = await redisClient.get(key);
    return cachedValue ? JSON.parse(cachedValue) : null;
  } catch (err) {
    console.warn(`⚠️ Redis Error: ${err.message}`);
    return null;
  }
};

// Store translation in Redis
const setCachedTranslation = async (key, value) => {
  try {
    if (!redisClient.isReady) throw new Error("Redis is not connected");
    await redisClient.set(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`⚠️ Redis Error: ${err.message}`);
  }
};

// Translate text with caching and DB check
export const translateText = async (faq, targetLang) => {
  if (!faq || !targetLang || targetLang === "en") return faq;

  const cacheKey = `faq:${faq._id}:${targetLang}`;
  const cachedTranslation = await getCachedTranslation(cacheKey);
  if (cachedTranslation) return cachedTranslation;

  const storedTranslation = faq.translations.find((t) => t.lang === targetLang);
  if (storedTranslation) {
    await setCachedTranslation(
        cacheKey,
        storedTranslation,
    ); // Cache DB translation
    return storedTranslation;
  }

  try {
    const translatedFaq = {
      _id: faq._id,
      question: await translateUsingGoogleAPI(faq.question, targetLang),
      answer: await translateUsingGoogleAPI(faq.answer, targetLang),
    };

    await setCachedTranslation(cacheKey, translatedFaq);
    return translatedFaq;
  } catch (error) {
    console.error("🔴 Translation error:", error.message);
    return {
      _id: faq._id,
      question: faq.question,
      answer: faq.answer,
    };
  }
};

// GET single FAQ
export const getFaqById = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({message: "FAQ not found"});
    }

    const translatedFaq = await translateText(faq, lang);
    res.status(200).json(translatedFaq);
  } catch (err) {
    res.status(500).json({message: "Error fetching FAQ", error: err.message});
  }
};

// GET all FAQs
export const getAllFaqs = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const faqs = await Faq.find({});

    const translatedFaqs = await Promise.all(
        faqs.map(async (faq) => translateText(faq, lang)),
    );

    res.status(200).json(translatedFaqs);
  } catch (err) {
    res.status(500).json({message: "Error fetching FAQs", error: err.message});
  }
};

// POST Create FAQ
export const createFaq = async (req, res) => {
  try {
    const {question, answer} = req.body;
    if (!question || !answer) {
      return res.status(400).json(
          {message: "Question and answer are required"},
      );
    }

    const newFaq = new Faq({question, answer, translations: []});
    const savedFaq = await newFaq.save();

    const translations = await Promise.all(
        ["hi", "bn", "es"].map(async (lang) => ({
          lang,
          question: await translateUsingGoogleAPI(savedFaq.question, lang),
          answer: await translateUsingGoogleAPI(savedFaq.answer, lang),
        })),
    );

    savedFaq.translations = translations;
    await savedFaq.save();

    res.status(201).json({message: "FAQ created successfully", faq: savedFaq});
  } catch (err) {
    res.status(500).json({message: "Error creating FAQ", error: err.message});
  }
};

// PUT Update FAQ
export const updateFaq = async (req, res) => {
  try {
    const {question, answer} = req.body;
    const faqId = req.params.id;

    if (!question || !answer) {
      return res.status(400).json(
          {message: "Question and answer are required"},
      );
    }

    const faq = await Faq.findById(faqId);
    if (!faq) {
      return res.status(404).json({message: "FAQ not found"});
    }

    faq.question = question;
    faq.answer = answer;

    const updatedFaq = await faq.save();
    const existingTranslations = faq.translations;

    const newTranslations = await Promise.all(
        ["hi", "bn", "es"].map(async (lang) => {
          const existing = existingTranslations.find((t) => t.lang === lang);
          const translatedQuestion = existing ?
          existing.question :
          await translateUsingGoogleAPI(question, lang);
          const translatedAnswer = existing ?
          existing.answer :
          await translateUsingGoogleAPI(answer, lang);
          return {
            lang,
            question: translatedQuestion,
            answer: translatedAnswer,
          };
        }),
    );

    faq.translations = newTranslations;
    await faq.save();

    res.status(200).json(
        {message: "FAQ updated successfully",
          faq: updatedFaq},
    );
  } catch (err) {
    res.status(500).json(
        {message: "Error updating FAQ",
          error: err.message},
    );
  }
};

// DELETE FAQ
export const deleteFaq = async (req, res) => {
  try {
    const deletedFaq = await Faq.findByIdAndDelete(req.params.id);
    if (!deletedFaq) {
      return res.status(404).json({message: "FAQ not found"});
    }

    res.status(200).json({message: "FAQ deleted successfully"});
  } catch (err) {
    res.status(500).json({message: "Error deleting FAQ", error: err.message});
  }
};
