import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set } from 'firebase/database';
import { database } from '../config/firebase';
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Button,
} from '@mui/material';

interface Class {
  name: string;
  subjects: { id: string; name: string }[];
}

const AddExam: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [examType, setExamType] = useState<string>('');
  const [examDate, setExamDate] = useState<string>('');
  const [maxMarks, setMaxMarks] = useState<number>(0);

  useEffect(() => {
    const classesRef = ref(database, 'classes');
    onValue(classesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedClasses: Class[] = Object.keys(data).map((key) => {
          const classData = data[key];
          return {
            name: key.replace('_', ' '),
            subjects: classData.subjects
              ? Object.keys(classData.subjects).map((subjectId) => ({
                  id: subjectId,
                  name: classData.subjects[subjectId].subjectName, 
                }))
              : [],
          };
        });
        setClasses(loadedClasses);
      }
    });
  }, []);

  const handleClassChange = (event: SelectChangeEvent<string>) => {
    const selectedClass = event.target.value;
    setSelectedClass(selectedClass);

    const classData = classes.find((cls) => cls.name === selectedClass);
    if (classData) {
      setSubjects(classData.subjects);
      setSelectedSubject('');
    } else {
      setSubjects([]);
      setSelectedSubject('');
    }
  };

  const handleAddExam = () => {
    const examRef = ref(database, 'exams');
    const newExamRef = push(examRef);
    const selectedSubjectData = subjects.find((subj) => subj.id === selectedSubject);

    if (selectedSubjectData) {
      set(newExamRef, {
        class: selectedClass,
        subject: selectedSubjectData.name,
        type: examType,
        date: examDate,
        maxMarks: maxMarks,
      });
    } else {
      console.error('Selected subject data not found');
    }

    setSelectedClass('');
    setSelectedSubject('');
    setExamType('');
    setExamDate('');
    setMaxMarks(0);
  };

  return (
    <Container className="mt-4">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Exam
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="select-class-label">Select Class</InputLabel>
          <Select
            labelId="select-class-label"
            id="select-class"
            value={selectedClass}
            onChange={handleClassChange}
          >
            {classes.map((cls, index) => (
              <MenuItem key={index} value={cls.name}>
                Class {cls.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedClass && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-subject-label">Select Subject</InputLabel>
            <Select
              labelId="select-subject-label"
              id="select-subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as string)}
            >
              {subjects.map((subject, index) => (
                <MenuItem key={index} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {selectedSubject && (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Exam Type"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Date of Exam"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Max Marks"
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
            />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddExam}
              >
                Add Exam
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default AddExam;
