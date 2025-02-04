import { React, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FaqList from './components/faqList';
import FAQEditor from './components/FAQEditor';
import FaqDetail from './components/faqDetails';
import AdminLogin from './components/adminLogin';
import { useAuthStore } from './store/authStore';

const App = () => {
  const { isAdminLoggedIn } = useAuthStore();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth(); // Validate admin token on app load
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FaqList />} />
        <Route path="/faq/:id" element={<FaqDetail />} />
        
        {/* Protected routes that require admin login */}
        <Route 
          path="/create-faq" 
          element={isAdminLoggedIn ? <FAQEditor /> : <Navigate to="/admin-login" />} 
        />
        <Route 
          path="/edit-faq/:id" 
          element={isAdminLoggedIn ? <FAQEditor /> : <Navigate to="/admin-login" />} 
        />

        {/* Admin login route */}
        <Route 
          path="/admin-login" 
          element={!isAdminLoggedIn ? <AdminLogin /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
