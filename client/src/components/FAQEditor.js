import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "../assets/css/FAQEditor.css"; 
import { getFaqById, createFaq, updateFaq } from "../api/api.js"; // Import API functions

const FAQEditor = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  const [faq, setFaq] = useState({
    question: "",
    answer: "",
    translations: [],
  });

  useEffect(() => {
    if (id) {
      const fetchFaq = async () => {
        try {
          const data = await getFaqById(id);
          setFaq(data);
        } catch (error) {
          console.error("Error fetching FAQ:", error);
        }
      };
      fetchFaq();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFaq((prevFaq) => ({ ...prevFaq, [name]: value }));
  };

  const handleAnswerChange = (value) => {
    setFaq((prevFaq) => ({ ...prevFaq, answer: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateFaq(id, faq);
      } else {
        await createFaq(faq);
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving FAQ:", error);
    }
  };

  const formatUrl = (url) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4">{id ? "Edit FAQ" : "Create FAQ"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Question:</label>
            <input
              type="text"
              className="form-control"
              name="question"
              value={faq.question}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Answer:</label>
            <ReactQuill value={faq.answer} onChange={handleAnswerChange} required />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              {id ? "Update FAQ" : "Create FAQ"}
            </button>
          </div>
        </form>

        {faq.answer && (
          <div className="mt-4">
            <h5>Preview:</h5>
            <div
              className="quill-content"
              dangerouslySetInnerHTML={{
                __html: faq.answer.replace(
                  /<a href="(.*?)"/g,
                  (match, url) =>
                    `<a href="${formatUrl(url)}" target="_blank" rel="noopener noreferrer"`
                ),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQEditor;
