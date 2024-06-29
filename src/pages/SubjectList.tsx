import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface Subject {
  classLevel: string;
  subjectName: string;
}

const SubjectList: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
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

    const subjectsRef = ref(database, 'subjects/');
    onValue(subjectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedSubjects: Subject[] = [];
        Object.keys(data).forEach(subjectName => {
          Object.keys(data[subjectName]).forEach(key => {
            const subjectData = data[subjectName][key];
            loadedSubjects.push({
              classLevel: subjectData.classLevel,
              subjectName: subjectData.subjectName,
            });
          });
        });
        setSubjects(loadedSubjects);
      }
    });
  }, []);

  const handleClassChange = (event: SelectChangeEvent<string>) => {
    setFilterClass(event.target.value);
  };

  const filteredSubjects = filterClass
    ? subjects.filter(subject => subject.classLevel === filterClass)
    : subjects;

  return (
    <div className="container mt-4">
      <h2>Subject List</h2>
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Class Level</TableCell>
              <TableCell>Subject Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubjects.map((subject, index) => (
              <TableRow key={index}>
                <TableCell>{subject.classLevel}</TableCell>
                <TableCell>{subject.subjectName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SubjectList;
