import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const FAQEditor = () => {
  const { id } = useParams(); // Get FAQ ID from URL
  const navigate = useNavigate(); // For redirection

  const [faq, setFaq] = useState({
    question: "",
    answer: "",
    translations: [], // Holds all pre-translated content
  });

  const [selectedLang, setSelectedLang] = useState("en"); // Selected language
  const [loading, setLoading] = useState(false); // Translation loading state

  useEffect(() => {
    if (id) {
      const fetchFaq = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/faqs/${id}?lang=${selectedLang}`
          );
          setFaq(response.data);
        } catch (error) {
          console.error("Error fetching FAQ:", error);
        }
      };
      fetchFaq();
    }
  }, [id, selectedLang]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFaq((prevFaq) => ({ ...prevFaq, [name]: value }));
  };

  const handleAnswerChange = (value) => {
    setFaq((prevFaq) => ({ ...prevFaq, answer: value }));
  };

  const handleTranslationChange = (lang, field, value) => {
    setFaq((prevFaq) => ({
      ...prevFaq,
      translations: prevFaq.translations.map((t) =>
        t.lang === lang ? { ...t, [field]: value } : t
      ),
    }));
  };

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
  };

  const addTranslation = async (lang) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/faqs/translate", {
        question: faq.question,
        answer: faq.answer,
        lang,
      });

      const newTranslation = {
        lang,
        question: response.data.translatedQuestion,
        answer: response.data.translatedAnswer,
      };

      setFaq((prevFaq) => ({
        ...prevFaq,
        translations: [...prevFaq.translations, newTranslation],
      }));
      setSelectedLang(lang);
    } catch (error) {
      console.error("Error translating content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/faqs/${id}`, faq);
      } else {
        await axios.post("http://localhost:5000/api/faqs", faq);
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving FAQ:", error);
    }
  };

  const currentTranslation = faq.translations.find((t) => t.lang === selectedLang);

  return (
    <div>
      <h1>{id ? "Edit FAQ" : "Create FAQ"}</h1>

      <div>
        <button onClick={() => handleLanguageChange("en")}>English</button>
        <button onClick={() => addTranslation("hi")}>
          {loading && selectedLang === "hi" ? "Translating..." : "Add Hindi"}
        </button>
        <button onClick={() => addTranslation("bn")}>
          {loading && selectedLang === "bn" ? "Translating..." : "Add Bengali"}
        </button>
        <button onClick={() => addTranslation("es")}>
          {loading && selectedLang === "es" ? "Translating..." : "Add Spanish"}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {selectedLang === "en" ? (
          <>
            <div>
              <label>Question (English):</label>
              <input
                type="text"
                name="question"
                value={faq.question}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label>Answer (English):</label>
              <ReactQuill value={faq.answer} onChange={handleAnswerChange} required />
            </div>
          </>
        ) : currentTranslation ? (
          <>
            <div>
              <label>{`Question (${selectedLang.toUpperCase()})`}</label>
              <input
                type="text"
                value={currentTranslation.question}
                onChange={(e) =>
                  handleTranslationChange(selectedLang, "question", e.target.value)
                }
              />
            </div>

            <div>
              <label>{`Answer (${selectedLang.toUpperCase()})`}</label>
              <ReactQuill
                value={currentTranslation.answer}
                onChange={(value) =>
                  handleTranslationChange(selectedLang, "answer", value)
                }
              />
            </div>
          </>
        ) : null}

        <button type="submit">{id ? "Update FAQ" : "Create FAQ"}</button>
      </form>
    </div>
  );
};

export default FAQEditor;
