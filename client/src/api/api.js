import { axiosInstance } from "../lib/axios";

export const getAllFaqs = async (lang = "en") => {
  try {
    const response = await axiosInstance.get(`/faqs?lang=${lang}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching FAQs", error);
    throw error;
  }
};

export const getFaqById = async (id, lang = "en") => {
  try {
    const response = await axiosInstance.get(`/faqs/${id}?lang=${lang}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching FAQ by ID", error);
    throw error;
  }
};

export const createFaq = async (faqData) => {
  try {
    const response = await axiosInstance.post(`/faqs`, faqData);
    return response.data;
  } catch (error) {
    console.error("Error creating FAQ", error);
    throw error;
  }
};

export const updateFaq = async (id, faqData) => {
  try {
    const response = await axiosInstance.put(`/faqs/${id}`, faqData);
    return response.data;
  } catch (error) {
    console.error("Error updating FAQ", error);
    throw error;
  }
};

export const deleteFaq = async (id) => {
  try {
    const response = await axiosInstance.delete(`/faqs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting FAQ", error);
    throw error;
  }
};

export const adminLogin = async (credentials) => {
  try {
    const response = await axiosInstance.post(`/admin/login`, credentials);
    return response;
  } catch (error) {
    console.error("Error logging in as admin", error);
    throw error;
  }
};

export const adminLogout = async() =>{
  try {
    const response = await axiosInstance.post(`/admin/logout`);
    console.log(response);
    if (response.data.success) {
      console.log("Logout successful:", response.data.message);
      // Optionally, redirect the user or perform any additional actions on successful logout
    } else {
      console.error("Logout failed:", response.data.message);
    }
  
  } catch (error) {
    console.error("Logout error:", error.response ? error.response.data.message : error.message);
  }
}
