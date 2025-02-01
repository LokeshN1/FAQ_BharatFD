// models/faqModel.js

import mongoose from 'mongoose';

// Define the FAQ Schema
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true, // Default question (English or default language)
  },
  answer: {
    type: String,
    required: true, // Default answer
  },
  translations: [
    {
      lang: {
        type: String,  // Language code (e.g., 'hi' for Hindi, 'bn' for Bengali)
        required: true,
      },
      question: {
        type: String,  // Translated question
        required: true,
      },
      answer: {
        type: String,  // Translated answer
        required: true,
      },
    },
  ],
}, {
  timestamps: true,  // Automatically add createdAt and updatedAt timestamps
});

// Method to get translated question dynamically
faqSchema.methods.getTranslatedQuestion = function (lang) {
  const translation = this.translations.find(t => t.lang === lang);
  return translation ? translation.question : this.question;  // Fallback to the default question
};

// Method to get translated answer dynamically
faqSchema.methods.getTranslatedAnswer = function (lang) {
  const translation = this.translations.find(t => t.lang === lang);
  return translation ? translation.answer : this.answer;  // Fallback to the default answer
};

// Create the FAQ model
const Faq = mongoose.model('Faq', faqSchema);

export default Faq;
