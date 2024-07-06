import React, { useState } from 'react';
import { useNavigate, Link,Routes,Route } from 'react-router-dom';
import { TextField, Button, Typography, Container, Card, CardContent, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AdmissionForm from './AdmissionForm';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      setError(null);
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  };

  return (
   
    <Container maxWidth="sm" style={{ marginTop: '4rem' }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email address"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }}>
              Login
            </Button>
            {error && <Alert severity="error" style={{ marginTop: '1rem' }}>{error}</Alert>}
          </form>
   

          <Typography variant="body2" align="center" style={{ marginTop: '1rem' }}>
            Don't have an account? <Link to="/admission-form">Apply For Admission</Link>
          </Typography>
        </CardContent>
      </Card>
  
    </Container>
    
  );
};

export default LoginForm;
