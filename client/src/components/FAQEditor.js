import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const FAQEditor = () => {
  const { id } = useParams();  // Get the FAQ ID from the URL params (for editing)
  const navigate = useNavigate(); // Redirect after successful operation

  const [faq, setFaq] = useState({
    question: '',
    answer: '',  // Default language (English)
  });

  // Fetch FAQ data when in edit mode
  useEffect(() => {
    if (id) {
      const fetchFaq = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/faqs/${id}`);
          setFaq({
            question: response.data.question,
            answer: response.data.answer,
          });
        } catch (error) {
          console.error('Error fetching FAQ:', error);
        }
      };
      fetchFaq();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFaq({ ...faq, [name]: value });
  };

  const handleAnswerChange = (value) => {
    setFaq({ ...faq, answer: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Update FAQ (PUT request)
        const response = await axios.put(`http://localhost:5000/api/faqs/${id}`, faq);
        console.log('FAQ updated successfully:', response.data);
      } else {
        // Create new FAQ (POST request)
        const response = await axios.post('http://localhost:5000/api/faqs', faq);
        console.log('FAQ created successfully:', response.data);
      }
      navigate('/');  // Redirect after success (you can change this to a specific page)
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  return (
    <div>
      <h1>{id ? 'Edit FAQ' : 'Create FAQ'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Question:</label>
          <input
            type="text"
            name="question"
            value={faq.question}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Answer:</label>
          <ReactQuill
            value={faq.answer}
            onChange={handleAnswerChange}
            placeholder="Type the answer"
            required
          />
        </div>

        <button type="submit">{id ? 'Update FAQ' : 'Create FAQ'}</button>
      </form>
    </div>
  );
};

export default FAQEditor;