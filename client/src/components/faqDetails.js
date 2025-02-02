import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import Select from "react-select";

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
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : faq ? (
        <div>
          <h3>{faq.question}</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(faq.answer),
            }}
          />

          {/* Language Selector */}
          <div style={{ marginTop: "20px" }}>
            <label>Select Language: </label>
            <Select
              options={languages}
              value={selectedLang}
              onChange={setSelectedLang}
            />
          </div>
        </div>
      ) : (
        <p>FAQ not found</p>
      )}
    </div>
  );
};

export default FaqDetail;
