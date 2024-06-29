import React, { useState, useEffect } from 'react';
import { ref, push, set, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import { Container, Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const FeeStructureForm: React.FC = () => {
  const [classLevel, setClassLevel] = useState<string>('');
  const [tuitionFee, setTuitionFee] = useState<number>(0);
  const [libraryFee, setLibraryFee] = useState<number>(0);
  const [sportsFee, setSportsFee] = useState<number>(0);
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    const classRef = ref(database, 'classes');
    onValue(classRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const classLevels = Object.keys(data);
        setClasses(classLevels);
      }
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const totalFee = tuitionFee + libraryFee + sportsFee;

    try {
      const newFeeRef = push(ref(database, 'fees'));
      await set(newFeeRef, {
        classLevel,
        tuitionFee,
        libraryFee,
        sportsFee,
        totalFee,
      });
      console.log('New fee structure added successfully');
      setClassLevel('');
      setTuitionFee(0);
      setLibraryFee(0);
      setSportsFee(0);
    } catch (error) {
      console.error('Error adding fee structure:', error);
    }
  };

  return (
    <Container className="mt-4">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Fee Structure
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <FormControl fullWidth>
              <InputLabel id="classLevel-label">Class Level</InputLabel>
              <Select
                labelId="classLevel-label"
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value as string)}
                variant="outlined"
                fullWidth
              >
                {classes.map((cls, index) => (
                  <MenuItem key={index} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="mb-3">
            <TextField
              label="Tuition Fee"
              type="number"
              value={tuitionFee}
              onChange={(e) => setTuitionFee(Number(e.target.value))}
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="mb-3">
            <TextField
              label="Library Fee"
              type="number"
              value={libraryFee}
              onChange={(e) => setLibraryFee(Number(e.target.value))}
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="mb-3">
            <TextField
              label="Sports Fee"
              type="number"
              value={sportsFee}
              onChange={(e) => setSportsFee(Number(e.target.value))}
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

export default FeeStructureForm;
