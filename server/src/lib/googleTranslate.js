import translate from "google-translate-api-x";

export const translateUsingGoogleAPI = async (text, targetLang) => {
  try {
    if (!text || !targetLang || targetLang === "en") {
      return text;
    }

    console.log(`Translating: "${text}" -> "${targetLang}"`);
    const result = await translate(text, {to: targetLang});
    console.log(`Translation: "${result.text}"`);
    return result.text;
  } catch (error) {
    console.error("Google Translate API error:", error.message);
    return text;
  }
};
