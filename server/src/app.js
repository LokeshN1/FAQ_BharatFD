import dotenv from 'dotenv';

import express from 'express';

dotenv.config({ path: './src/.env' });

import mongoose from 'mongoose';
import { connectDB } from "./lib/db.js";
import cors from "cors";


import faqRoutes from './routes/faq.Routes.js'
// console.log("Dotenv Loaded:", process.env);

const app = express();
const PORT = process.env.PORT || 5000;
console.log(process.env.PORT);

// Middleware to parse JSON
app.use(express.json());


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

// FAQ routes
app.use('/api', faqRoutes);

// A simple route to test the server
app.get('/', (req, res) => {
  res.send('Hello from the FAQ API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
