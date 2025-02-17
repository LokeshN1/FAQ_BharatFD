// src/store/authStore.js
import { create } from "zustand";
import { adminLogout, checkAdminAuth } from "../api/api";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const useAuthStore = create((set) => ({
  isAdminLoggedIn: false,

  // Login function updates Zustand state
  login: () => set({ isAdminLoggedIn: true }),

  // Logout function calls API & updates Zustand state
  logout: async () => {
    try {
      await adminLogout();
      set({ isAdminLoggedIn: false });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  // Check authentication status from API
  checkAuth: async () => {
    try {
      const response = await checkAdminAuth();
      if (response.status === 200) {
        set({ isAdminLoggedIn: true });
      } else {
        set({ isAdminLoggedIn: false });
      }
    } catch (error) {
      set({ isAdminLoggedIn: false });
      console.error("Auth check error:", error);
    }
  },
}));
