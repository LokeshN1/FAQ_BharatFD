import dotenv from 'dotenv';
import { connectDB } from './src/lib/db.js';
import Faq from './src/model/faq.model.js';  // Path to your model

dotenv.config({ path: './src/.env' });

// Function to create and insert an FAQ     -> for inserting a sample data in schema
const createFaq = async () => {
    const faq = new Faq({
      question: 'What is your name?',  // Default question (English)
      answer: 'This is the default answer.',
      translations: [
        { lang: 'hi', question: 'आपका नाम क्या है?', answer: 'यह उत्तर हिंदी में है।' },  // Hindi translation
        { lang: 'bn', question: 'আপনার নাম কী?', answer: 'এটি বাংলা উত্তর।' },  // Bengali translation
      ],
    });
  
    try {
      await faq.save();  // Save the FAQ to the database
      console.log('FAQ created successfully');
    } catch (err) {
      console.error('Error creating FAQ:', err);
    }
  };

// Connect to MongoDB and then create an FAQ
connectDB().then(() => {
  createFaq();  // Call the function to insert data after the DB connection is successful
}).catch(err => {
  console.error('Error connecting to the database:', err);
});