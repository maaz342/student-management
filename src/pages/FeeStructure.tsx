import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import { Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface Fee {
  id: string;
  classLevel: string;
  tuitionFee: number;
  libraryFee: number;
  sportsFee: number;
  totalFee: number;
}

const FeeStructure: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [filterClass, setFilterClass] = useState<string>('');

  const [classOptions, setClassOptions] = useState<string[]>([]);

  useEffect(() => {
    const classesRef = ref(database, 'classes/');
    onValue(classesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const classLevels = Object.keys(data);
        setClassOptions(classLevels); 
      }
    });

    const feeRef = ref(database, 'fees');
    onValue(feeRef, (snapshot) => {
      const data = snapshot.val();
      const feeArray: Fee[] = [];
      for (let id in data) {
        feeArray.push({ id, ...data[id] });
      }
      setFees(feeArray);
    });
  }, []);

  const handleClassChange = (event: SelectChangeEvent<string>) => {
    setFilterClass(event.target.value);
  };

  const filteredFees = filterClass
    ? fees.filter(fee => fee.classLevel === filterClass)
    : fees;

  return (
    <Container className="mt-4">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          School Fee Structure
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="filter-class-label">Filter by Class Level</InputLabel>
          <Select
            labelId="filter-class-label"
            id="filter-class"
            value={filterClass}
            onChange={handleClassChange}
          >
            <MenuItem value="">All Classes</MenuItem>
            {classOptions.map((classLevel, index) => (
              <MenuItem key={index} value={classLevel}>
                Class {classLevel}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Class</TableCell>
                <TableCell align="right">Tuition Fee</TableCell>
                <TableCell align="right">Library Fee</TableCell>
                <TableCell align="right">Sports Fee</TableCell>
                <TableCell align="right">Total Fee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell component="th" scope="row">
                    {fee.classLevel}
                  </TableCell>
                  <TableCell align="right">${fee.tuitionFee}</TableCell>
                  <TableCell align="right">${fee.libraryFee}</TableCell>
                  <TableCell align="right">${fee.sportsFee}</TableCell>
                  <TableCell align="right">${fee.totalFee}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default FeeStructure;
