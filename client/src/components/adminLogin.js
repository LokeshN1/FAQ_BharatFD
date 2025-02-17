import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/api.js";
import { useAuthStore } from "../store/authStore.js";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login); // Zustand login action

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await adminLogin({ email, password }); // Send request to backend

      if (response.status === 200) {
        login(); //  Update Zustand state
        navigate("/"); // Redirect to FAQ list page after successful login
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Login</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
