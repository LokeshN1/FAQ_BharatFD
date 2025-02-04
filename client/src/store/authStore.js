// src/store/authStore.js
import {create} from "zustand";

export const useAuthStore = create((set, get) => ({
  // Initial state
  isAdminLoggedIn: false,

  // Action to log in the admin
  login: () => set({ isAdminLoggedIn: true }),

  // Action to log out the admin
  logout: () => set({ isAdminLoggedIn: false }),

  // Action to check authentication status
  checkAuth: async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/check-auth", {
        method: "GET",
        credentials: "include", // Include cookies for session
      });
      if (response.ok) {
        const data = await response.json(); // Parse the JSON
        console.log("Auth Check Response:", data); // Debug response
        set({ isAdminLoggedIn: true });
      } else {
        console.log("Auth Check Failed:", response.status);
        set({ isAdminLoggedIn: false });
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      set({ isAdminLoggedIn: false });
    }
  },
  
}));
