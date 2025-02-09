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

  const formatUrl = (url) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };
  
  const sanitizeHtml = (html) => {
    const sanitizedHtml = DOMPurify.sanitize(html, {
      ADD_ATTR: ["target", "rel"],
      FORBID_TAGS: ["style"],
      FORBID_ATTR: ["style"],
    });
  
    // Replace links with formatted URLs
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitizedHtml;
  
    const links = tempDiv.getElementsByTagName("a");
    for (let link of links) {
      const href = link.getAttribute("href");
      if (href) {
        link.setAttribute("href", formatUrl(href));
        link.setAttribute("target", "_blank"); // Ensure links open in a new tab
        link.setAttribute("rel", "noopener noreferrer"); // Add security attributes
      }
    }
  
    return tempDiv.innerHTML;
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
                __html: sanitizeHtml(faq.answer),
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