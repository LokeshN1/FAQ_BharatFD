import dotenv from "dotenv";
import {connectDB} from "./src/lib/db.js";
import Faq from "./src/model/faq.model.js"; // Path to your model

dotenv.config({path: "./src/.env"});

// Function to create and insert an FAQ (sample data for the schema)
const createFaq = async () => {
  const faq = new Faq({
    question: "What is your name?", // Default question (English)
    answer: "This is the default answer.",
    translations: [
      {
        lang: "hi",
        question: "आपका नाम क्या है?",
        answer: "यह उत्तर हिंदी में है।",
      },
      {
        lang: "bn",
        question: "আপনার নাম কী?",
        answer: "এটি বাংলা উত্তর।",
      },
    ],
  });

  try {
    await faq.save();
    console.log("FAQ created successfully");
  } catch (err) {
    console.error("Error creating FAQ:", err);
  }
};

// Connect to MongoDB and insert the FAQ after a successful connection
connectDB()
    .then(() => createFaq())
    .catch((err) => console.error("Error connecting to the database:", err));
