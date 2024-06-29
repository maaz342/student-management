import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, Button as MuiButton } from '@mui/material';
import SelectComponent from '../components/Select'; 
import { SelectChangeEvent } from '@mui/material';
import SyllabusForm from './SyllabusForm'; 
interface Syllabus {
  id: string; 
  classLevel: string;
  subjectName: string;
  syllabusDetails: string;
}

const SyllabusList: React.FC = () => {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [filterClass, setFilterClass] = useState<string>('');
  const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(null);

  useEffect(() => {
    fetchSyllabuses();
  }, []);

  const fetchSyllabuses = async () => {
    const syllabusesRef = ref(database, 'syllabus');
    try {
      const snapshot = await get(syllabusesRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedSyllabuses: Syllabus[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setSyllabuses(loadedSyllabuses);
      }
    } catch (error) {
      console.error('Error fetching syllabuses:', error);
    }
  };

  const formatSyllabusDetails = (syllabusDetails: string) => {
    return syllabusDetails.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const handleClassChange = (event: SelectChangeEvent<string>) => {
    const selectedClass = event.target.value;
    setFilterClass(selectedClass);
  };

  const filteredSyllabuses = filterClass
    ? syllabuses.filter(syllabus => syllabus.classLevel === filterClass)
    : syllabuses;

  const handleEditSyllabus = (syllabus: Syllabus) => {
    setSelectedSyllabus(syllabus);
  };

  const handleCloseForm = () => {
    setSelectedSyllabus(null);
  };

  return (
    <div className="container mt-4">
      <h2>Syllabus List</h2>
      <FormControl fullWidth variant="outlined" margin="normal">
        <SelectComponent
          id="filter-class"
          name="filter-class"
          value={filterClass}
          onChange={handleClassChange}
          label="Filter by Class"
          options={[{ value: '', label: 'All Classes' }, ...syllabuses.map(syllabus => ({ value: syllabus.classLevel, label: `Class ${syllabus.classLevel}` }))]}
        />
      </FormControl>
      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Class Level</TableCell>
              <TableCell>Subject Name</TableCell>
              <TableCell>Syllabus Details</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSyllabuses.map((syllabus, index) => (
              <TableRow key={index}>
                <TableCell>{syllabus.classLevel}</TableCell>
                <TableCell>{syllabus.subjectName}</TableCell>
                <TableCell>{formatSyllabusDetails(syllabus.syllabusDetails)}</TableCell>
                <TableCell>
                  <MuiButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditSyllabus(syllabus)}
                  >
                    Edit
                  </MuiButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedSyllabus && (
        <SyllabusForm
          syllabus={selectedSyllabus}
          onClose={handleCloseForm}
          onSave={() => {
            handleCloseForm();
            fetchSyllabuses(); 
          }}
        />
      )}
    </div>
  );
};

export default SyllabusList;
