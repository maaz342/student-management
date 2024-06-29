import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import {
  Container,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from '@mui/material';

interface Exam {
  id: string;
  class: string;
  subject: string;
  type: string;
  date: string;
  maxMarks: number;
}

const ExamSchedule: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const examsRef = ref(database, 'exams');
    onValue(examsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedExams: Exam[] = Object.keys(data).map((key) => ({
          id: key,
          class: data[key].class,
          subject: data[key].subject,
          type: data[key].type,
          date: data[key].date,
          maxMarks: data[key].maxMarks,
        }));
        setExams(loadedExams);
      }
    });
  }, []);

  const handleDeleteExam = (id: string) => {
  };

  return (
    <Container className="mt-4">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Exam Schedule
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Class</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Max Marks</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.class}</TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>{exam.type}</TableCell>
                  <TableCell>{exam.date}</TableCell>
                  <TableCell>{exam.maxMarks}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteExam(exam.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default ExamSchedule;