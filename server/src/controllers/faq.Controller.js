import Faq from "../model/faq.model.js";
import { redisClient } from "../lib/redis.js";
import { translateUsingGoogleAPI } from "../lib/googleTranslate.js"; // Import helper function

// Function to get cached translation from Redis
const getCachedTranslation = async (key) => {
  try {
    if (!redisClient.isReady) throw new Error("Redis is not connected"); // Check Redis connection
    console.log(`🔍 Fetching key: "${key}"`);
    const cachedValue = await redisClient.get(key);

    if (!cachedValue) {
      console.log(`Cache MISS -> Key: "${key}"`);
      return null;
    }

    console.log(`Cache HIT -> Key: "${key}"`);
    return JSON.parse(cachedValue); // Parse JSON string to object
  } catch (err) {
    console.warn(`⚠️ Redis Error (Skipping Cache): ${err.message}`);
    return null; // Fallback to no cache
  }
};

// Function to store translation in Redis
const setCachedTranslation = async (key, value) => {
  try {
    if (!redisClient.isReady) throw new Error("Redis is not connected"); // Check Redis connection
    const serializedValue = JSON.stringify(value); // Serialize object to JSON string
    await redisClient.set(key, serializedValue);
    console.log(`✅ Key "${key}" stored successfully in Redis!`);
  } catch (err) {
    console.warn(`⚠️ Redis Error (Skipping Cache Storage): ${err.message}`);
  }
};


// Function to translate text dynamically (Handles caching, DB check, and API translation)
export const translateText = async (faq, targetLang) => {
  if (!faq || !targetLang || targetLang === "en") return faq; // Return original FAQ if language is English

  const cacheKey = `faq:${faq._id}:${targetLang}`;

  // Step 1: Try to fetch from Redis cache
  const cachedTranslation = await getCachedTranslation(cacheKey);
  if (cachedTranslation) {
    console.log("✅ Cache HIT for", cacheKey);
    return cachedTranslation; // Return from cache
  }

  // Step 2: Check if the requested language exists in stored translations
  const storedTranslation = faq.translations.find((t) => t.lang === targetLang);
  if (storedTranslation) {
    console.log("📌 Using stored DB translation for", targetLang);
    return {
      _id: faq._id,
      question: storedTranslation.question,
      answer: storedTranslation.answer,
    };
  }

  // Step 3: Translate using the Google Translate API
  try {
    console.log("🌍 Translating using Google API...");
    const translatedFaq = {
      _id: faq._id,
      question: await translateUsingGoogleAPI(faq.question, targetLang),
      answer: await translateUsingGoogleAPI(faq.answer, targetLang),
    };

    // Step 4: Cache the newly translated FAQ in Redis for future use
    await setCachedTranslation(cacheKey, translatedFaq);

    return translatedFaq;
  } catch (error) {
    console.error("🔴 Translation error:", error.message);
    return {
      _id: faq._id,
      question: faq.question,
      answer: faq.answer, // Fallback to original text
    };
  }
};


// GET single FAQ by ID
export const getFaqById = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const faqId = req.params.id;

    // Step 1: Fetch FAQ from the database
    const faq = await Faq.findById(faqId);
    if (!faq) return res.status(404).json({ message: "FAQ not found in database" });

    // Step 2: Translate and return the response
    const translatedFaq = await translateText(faq, lang);
    res.status(200).json(translatedFaq);
  } catch (err) {
    console.error("🔴 Error fetching FAQ:", err.message);
    res.status(500).json({ message: "Error fetching FAQ", error: err.message });
  }
};


// GET all FAQs
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
    console.error("🔴 Error fetching FAQs:", err.message);
    res.status(500).json({ message: "Error fetching FAQs", error: err.message });
  }
};

// POST Create FAQ

export const createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    // Step 1: Create the FAQ object and save it (without translations)
    const newFaq = new Faq({
      question,
      answer,
      translations: [], // Start with empty translations array
    });

    // Save the FAQ to the database
    const savedFaq = await newFaq.save();

    // Step 2: Translate the question and answer into multiple languages
    const translations = await Promise.all(
      ["hi", "bn", "es"].map(async (lang) => {
        const translatedQuestion = await translateUsingGoogleAPI(savedFaq, lang);
        const translatedAnswer = await translateUsingGoogleAPI(savedFaq, lang);
        return { lang, question: translatedQuestion.question, answer: translatedAnswer.answer };
      })
    );

    // Step 3: Update the FAQ document with translations
    savedFaq.translations = translations;
    await savedFaq.save();

    // Step 4: Send success response with the newly created FAQ
    res.status(201).json({ message: "FAQ created successfully", faq: savedFaq });
  } catch (err) {
    console.error("🔴 Error creating FAQ:", err.message);
    res.status(500).json({ message: "Error creating FAQ", error: err.message });
  }
};


// PUT Update FAQ
export const updateFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faqId = req.params.id;

    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    // Step 1: Find the FAQ by ID
    const faq = await Faq.findById(faqId);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    // Step 2: Update the main question and answer in the FAQ
    faq.question = question;
    faq.answer = answer;

    // Step 3: Update translations with fresh translations using Google Translate
    await Promise.all(
      ["hi", "bn", "es"].map(async (lang) => {
        // Fetch new translations from Google Translate for each language
        const translatedQuestion = await translate(faq.question, { to: lang }).then(res => res.text);
        const translatedAnswer = await translate(faq.answer, { to: lang }).then(res => res.text);

        // Find the existing translation for the language
        const existingTranslation = faq.translations.find((t) => t.lang === lang);

        if (existingTranslation) {
          // Update the existing translation with the newly translated question and answer
          existingTranslation.question = translatedQuestion;
          existingTranslation.answer = translatedAnswer;
        } else {
          // If the translation does not exist, create a new one
          faq.translations.push({
            lang,
            question: translatedQuestion,
            answer: translatedAnswer,
          });
        }
      })
    );

    // Step 4: Save the updated FAQ with new translations
    const updatedFaq = await faq.save();

    if (!updatedFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    // Step 5: Invalidate the cache for the specific FAQ and all FAQs
    await redisClient.del(`faq:${faqId}:*`);  // Remove specific FAQ cache
    await redisClient.del(`faqs:*`);          // Remove the list of all FAQs from cache

    // Step 6: Return the updated FAQ response
    res.status(200).json({ message: "FAQ updated successfully", faq: updatedFaq });
  } catch (err) {
    console.error("🔴 Error updating FAQ:", err.message);
    res.status(500).json({ message: "Error updating FAQ", error: err.message });
  }
};


// DELETE FAQ
export const deleteFaq = async (req, res) => {
  try {
    const faqId = req.params.id;

    // Step 1: Delete the FAQ from the database
    const deletedFaq = await Faq.findByIdAndDelete(faqId);
    if (!deletedFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    // Step 2: Invalidate the cache for the specific FAQ and all FAQs
    await redisClient.del(`faq:${faqId}:*`);  // Remove the specific FAQ from the cache
    await redisClient.del(`faqs:*`);          // Clear the cache for all FAQs

    // Step 3: Return success message for deletion
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (err) {
    console.error("🔴 Error deleting FAQ:", err.message);
    res.status(500).json({ message: "Error deleting FAQ", error: err.message });
  }
};
