import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';

const FaqDetail = () => {
  const { id } = useParams();
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/faqs/${id}`);
        setFaq(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching FAQ:', error);
        setLoading(false);
      }
    };

    fetchFaq();
  }, [id]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : faq ? (
        <div>
          <h3>{faq.question}</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(faq.answer), // Sanitize and render HTML content safely
            }}
          />
          {/* Display translations if needed */}
        </div>
      ) : (
        <p>FAQ not found</p>
      )}
    </div>
  );
};

export default FaqDetail;