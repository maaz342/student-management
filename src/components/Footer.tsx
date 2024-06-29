import React from 'react';
import { Container, Grid, Typography, Box, Link } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#f8f9fa',
        py: 4,
        borderTop: '1px solid #e7e7e7',
      }}
    >
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">About Us</Typography>
            <Typography variant="body2">
              We are a school management system dedicated to providing the best educational tools and resources.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} className="text-center">
            <Typography variant="h6">Contact</Typography>
            <Typography variant="body2">Email: contact@school.com</Typography>
            <Typography variant="body2">Phone: +123 456 7890</Typography>
            <Typography variant="body2" className="mt-2">
              <Link href="/contact" underline="none">Get in Touch</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} className="text-end">
            <Typography variant="h6">Follow Us</Typography>
            <Typography variant="body2">
              <Link href="https://www.facebook.com" underline="none" target="_blank" rel="noopener">
                Facebook
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="https://www.twitter.com" underline="none" target="_blank" rel="noopener">
                Twitter
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="https://www.instagram.com" underline="none" target="_blank" rel="noopener">
                Instagram
              </Link>
            </Typography>
          </Grid>
        </Grid>
        <Box className="text-center mt-4">
          <Typography variant="body2">© 2024 School Management System. All rights reserved.</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
