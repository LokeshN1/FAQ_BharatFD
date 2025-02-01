import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllFaqs, deleteFaq } from '../api/api.js';
import DOMPurify from 'dompurify';

const FaqList = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getAllFaqs();
        setFaqs(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteFaq(id);
      setFaqs(faqs.filter(faq => faq._id !== id));
    } catch (error) {
      console.error('Error deleting FAQ');
    }
  };

  return (
    <div>
      <h1>FAQs</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {faqs.map(faq => (
            <li key={faq._id}>
              <h3>{faq.question}</h3>
              <div
                dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(faq.answer), // Sanitize and render HTML content safely
                }}
            />
              <Link to={`/faq/${faq._id}`}>View Details</Link> | 
              <Link to={`/edit-faq/${faq._id}`}>Edit</Link> | 
              <button onClick={() => handleDelete(faq._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <Link to="/create-faq">Create New FAQ</Link>
    </div>
  );
};

export default FaqList;
