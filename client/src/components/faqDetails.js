import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import Select from "react-select";
import "../assets/css/FaqDetail.css";

const FaqDetail = () => {
  const { id } = useParams();
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState({ value: "en", label: "English" });

  // Language options
  const languages = [
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "bn", label: "Bengali" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "ur", label: "Urdu" },
    { value: "ja", label: "Japanese" },
  ];

  useEffect(() => {
    fetchFaq(selectedLang.value);
  }, [id, selectedLang]);

  const fetchFaq = async (lang) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/faqs/${id}?lang=${lang}`);
      setFaq(response.data);
    } catch (error) {
      console.error("Error fetching FAQ:", error);
    }
    setLoading(false);
  };

  return (
    <div className="faq-container">
      <div className="faq-card">
        {loading ? (
          <p className="faq-loading">Loading...</p>
        ) : faq ? (
          <div>
            <h2 className="faq-question">{faq.question}</h2>
            <div
              className="faq-answer"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(faq.answer),
              }}
            />

            {/* Language Selector */}
            <div className="faq-lang-selector">
              <label>Select Language:</label>
              <Select
                options={languages}
                value={selectedLang}
                onChange={setSelectedLang}
                className="faq-select"
              />
            </div>
          </div>
        ) : (
          <p className="faq-not-found">FAQ not found</p>
        )}
      </div>
    </div>
  );
};

export default FaqDetail;
