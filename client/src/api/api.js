// src/api/api.js
import { axiosInstance } from "../lib/axios";

// Fetch all FAQs
export const getAllFaqs = async (lang = "en") => {
  try {
    const response = await axiosInstance.get(`/faqs?lang=${lang}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching FAQs", error);
    throw error;
  }
};

// Fetch single FAQ by ID
export const getFaqById = async (id, lang = "en") => {
  try {
    const response = await axiosInstance.get(`/faqs/${id}?lang=${lang}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching FAQ by ID", error);
    throw error;
  }
};

// Create a new FAQ
export const createFaq = async (faqData) => {
  try {
    const response = await axiosInstance.post(`/faqs`, faqData);
    return response.data;
  } catch (error) {
    console.error("Error creating FAQ", error);
    throw error;
  }
};

// Update an existing FAQ
export const updateFaq = async (id, faqData) => {
  try {
    const response = await axiosInstance.put(`/faqs/${id}`, faqData);
    return response.data;
  } catch (error) {
    console.error("Error updating FAQ", error);
    throw error;
  }
};

// Delete an FAQ
export const deleteFaq = async (id) => {
  try {
    const response = await axiosInstance.delete(`/faqs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting FAQ", error);
    throw error;
  }
};

// Admin login
export const adminLogin = async (credentials) => {
  try {
    const response = await axiosInstance.post(`/admin/login`, credentials, {
      withCredentials: true, 
    });
    return response;
  } catch (error) {
    console.error("Error logging in as admin", error);
    throw error;
  }
};


// Admin logout (clears cookie)
export const adminLogout = async () => {
  try {
    const response = await axiosInstance.post(`/admin/logout`);
    return response.data;
  } catch (error) {
    console.error("Logout error:", error.response ? error.response.data.message : error.message);
    throw error;
  }
};

// Check if admin is authenticated
export const checkAdminAuth = async () => {
  try {
    return await axiosInstance.get(`/admin/check-auth`, { withCredentials: true });
  } catch (error) {
    console.error("Auth check failed:", error);
    return error.response;
  }
};
