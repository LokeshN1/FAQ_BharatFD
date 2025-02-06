// models/faqModel.js

import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
    {
      question: {type: String, required: true},
      answer: {type: String, required: true},
      translations: [
        {
          lang: {type: String, required: true},
          question: {type: String, required: true},
          answer: {type: String, required: true},
        },
      ],
    },
    {timestamps: true},
);

faqSchema.methods.getTranslatedQuestion = function(lang) {
  const translation = this.translations.find((t) => t.lang === lang);
  return translation ? translation.question : this.question;
};

faqSchema.methods.getTranslatedAnswer = function(lang) {
  const translation = this.translations.find((t) => t.lang === lang);
  return translation ? translation.answer : this.answer;
};

const Faq = mongoose.model("Faq", faqSchema);
export default Faq;
