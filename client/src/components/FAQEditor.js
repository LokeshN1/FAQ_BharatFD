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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchFaq = async () => {
        try {
          setLoading(true);
          const data = await getFaqById(id);
          setFaq(data);
        } catch (error) {
          console.error("Error fetching FAQ:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchFaq();
    }
  }, [id]);

  const handleEditorChange = (field, value) => {
    setFaq((prevFaq) => ({ ...prevFaq, [field]: value }));
  };

  // Function to strip HTML tags
  const stripHtmlTags = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!faq.question || !faq.answer) {
        alert("Both Question and Answer fields are required!");
        return;
      }
      // Strip HTML tags from the question before saving
      const plainTextQuestion = stripHtmlTags(faq.question);
      const updatedFaq = { ...faq, question: plainTextQuestion };

      if (id) {
        await updateFaq(id, updatedFaq);
      } else {
        await createFaq(updatedFaq);
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

  const quillModules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4">{id ? "Edit FAQ" : "Create FAQ"}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Question:</label>
              <ReactQuill
                value={faq.question}
                onChange={(value) => handleEditorChange("question", value)}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Enter your question here..."
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Answer:</label>
              <ReactQuill
                value={faq.answer}
                onChange={(value) => handleEditorChange("answer", value)}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Enter your answer here..."
                required
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                {id ? "Update FAQ" : "Create FAQ"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4">
          {faq.question && (
            <div className="mt-4">
              <h5>Question Preview:</h5>
              <div
                className="quill-content"
                dangerouslySetInnerHTML={{
                  __html: faq.question.replace(
                    /<a href="(.*?)"/g,
                    (match, url) =>
                      `<a href="${formatUrl(url)}" target="_blank" rel="noopener noreferrer"`
                  ),
                }}
              />
            </div>
          )}

          {faq.answer && (
            <div className="mt-4">
              <h5>Answer Preview:</h5>
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
    </div>
  );
};

export default FAQEditor;