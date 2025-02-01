import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FaqList from './components/faqList';
import FAQEditor from './components/FAQEditor';
import FaqDetail from './components/faqDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FaqList />} />
        <Route path="/faq/:id" element={<FaqDetail />} />
        <Route path="/create-faq" element={<FAQEditor />} />
        <Route path="/edit-faq/:id" element={<FAQEditor />} />
      </Routes>
    </Router>
  );
};

export default App;