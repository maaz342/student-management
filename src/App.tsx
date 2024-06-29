// App.tsx

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/AppRouter'; // Adjust the path as per your project structure
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
      </>

  );
};

export default App;
