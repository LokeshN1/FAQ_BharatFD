import translate from "google-translate-api-x"; // Google Translate API

// Function to translate a given text to the target language using Google API
export const translateUsingGoogleAPI = async (text, targetLang) => {
  try {
    if (!text || !targetLang || targetLang === "en") return text; // No translation needed for English
    console.log(`Translating text: "${text}" to language: "${targetLang}"`);

    const result = await translate(text, { to: targetLang });
    console.log(`Translation successful: "${result.text}"`);
    return result.text; // Return translated text
  } catch (error) {
    console.error("Google Translate API error:", error.message);
    return text; // Fallback to original text
  }
};
