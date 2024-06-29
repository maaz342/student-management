import React, { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database } from '../config/firebase';
import { Container, Box, Typography, TextField, Button } from '@mui/material';

const ClassAddForm: React.FC = () => {
  const [classLevel, setClassLevel] = useState<string>('');
  const [classTeacher, setClassTeacher] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const classRef = ref(database, 'classes/' + classLevel.replace(' ', '_'));
      await set(classRef, {
        classLevel,
        classTeacher,
        description,
      });
      console.log('New class added successfully');
      setClassLevel('');
      setClassTeacher('');
      setDescription('');
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  return (
    <Container className="mt-4">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Class
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <TextField
              label="Class Level"
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              variant="outlined"
              fullWidth
              required
            />
          </div>
          <div className="mb-3">
            <TextField
              label="Class Teacher"
              value={classTeacher}
              onChange={(e) => setClassTeacher(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="mb-3">
            <TextField
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="d-flex justify-content-between">
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </div>
        </form>
      </Box>
    </Container>
  );
};

export default ClassAddForm;
