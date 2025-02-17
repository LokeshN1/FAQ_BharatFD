import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { getAllFaqs, deleteFaq } from "../api/api.js";

const FaqList = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdminLoggedIn = useAuthStore((state) => state.isAdminLoggedIn);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();

  // Check admin authentication status and fetch FAQs
  useEffect(() => {
    const fetchData = async () => {
      await checkAuth(); // Check if admin is logged in
      try {
        const data = await getAllFaqs();
        setFaqs(data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [checkAuth]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteFaq(id);
      setFaqs(faqs.filter((faq) => faq._id !== id));
    } catch (error) {
      console.error("Error deleting FAQ");
    }
  };

  const handleLogout = async () => {
    await logout(); // Call Zustand logout
    navigate("/"); // Redirect after logout
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">FAQs</h2>
        {isAdminLoggedIn ? (
          <>
            <Link to="/create-faq" className="btn btn-primary">
              + Create New FAQ
            </Link>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/admin-login" className="btn btn-success">
            Login as Admin
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="row">
          {faqs.map((faq) => (
            <div key={faq._id} className="col-md-6 mb-4">
              <div className="card shadow-sm faq-card">
                <div className="card-body">
                  <h5 className="card-title">{faq.question}</h5>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <Link to={`/faq/${faq._id}`} className="btn btn-outline-primary btn-sm">
                      View
                    </Link>
                    {isAdminLoggedIn && (
                      <Link to={`/edit-faq/${faq._id}`} className="btn btn-outline-secondary btn-sm">
                        Edit
                      </Link>
                    )}
                    {isAdminLoggedIn && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(faq._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FaqList;
