import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Login from '../pages/LoginForm';
import Footer from '../components/Footer';

const AppRouter: React.FC = () => {

  return (
    <Router>
      <Routes>
   
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/" element={<Login />} />

      </Routes>
      <Footer/>
    </Router>
  );
};

export default AppRouter;
