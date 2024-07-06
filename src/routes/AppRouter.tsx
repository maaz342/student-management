import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/LoginForm';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdmissionForm from '../pages/AdmissionForm';

const AppRouter: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />
      <Router>
        <Box
          component="main"
          sx={{
            flex: '1 0 auto',
          }}
        >
          <Routes>
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/" element={<Login />} />
            <Route path="/admission-form" element={<AdmissionForm />} />

          </Routes>
        </Box>
        <Footer />
      </Router>
    </Box>
  );
};

export default AppRouter;
