import axios from 'axios';

const API_URL = 'http://localhost:5000/api/faqs'; // Update with your backend URL

export const getAllFaqs = async (lang = 'en') => {
  try {
    const response = await axios.get(`${API_URL}?lang=${lang}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching FAQs', error);
    throw error;
  }
};

export const getFaqById = async (id, lang = 'en') => {
  try {
    const response = await axios.get(`${API_URL}/${id}?lang=${lang}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching FAQ by ID', error);
    throw error;
  }
};

export const createFaq = async (faqData) => {
  try {
    const response = await axios.post(API_URL, faqData);
    return response.data;
  } catch (error) {
    console.error('Error creating FAQ', error);
    throw error;
  }
};

export const updateFaq = async (id, faqData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, faqData);
    return response.data;
  } catch (error) {
    console.error('Error updating FAQ', error);
    throw error;
  }
};

export const deleteFaq = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting FAQ', error);
    throw error;
  }
};
