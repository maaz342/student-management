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
  subjects: { id: string; name: string; }[];
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  currentClass: string;
  enrollmentDate: string;
  promotionDate?: string;
  classHistory: ClassHistory[];
}

interface ClassHistory {
  className: string;
  year: string;
}

interface Exam {
  id: string;
  class: string;
  subject: string;
  type: string;
  date: string;
  maxMarks: number;
}

const AddExamResult: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [subjects, setSubjects] = useState<{ id: string; name: string; }[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<{ id: string; name: string; }>({
    id: '',
    name: '',
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [marks, setMarks] = useState<number>(0);
  const [maxMarks, setMaxMarks] = useState<number>(0);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examType, setExamType] = useState<string>('');

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

    const studentsRef = ref(database, 'students');
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedStudents: Student[] = Object.keys(data).map((key) => ({
          id: key,
          firstName: data[key].firstName,
          lastName: data[key].lastName,
          dateOfBirth: data[key].dateOfBirth,
          gender: data[key].gender,
          address: data[key].address,
          phone: data[key].phone,
          email: data[key].email,
          currentClass: data[key].currentClass,
          enrollmentDate: data[key].enrollmentDate,
          promotionDate: data[key].promotionDate,
          classHistory: data[key].classHistory,
        }));
        setStudents(loadedStudents);
      }
    });

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

  const handleClassChange = (event: SelectChangeEvent<string>) => {
    const selectedClass = event.target.value;
    setSelectedClass(selectedClass);

    const classData = classes.find((cls) => cls.name === selectedClass);
    if (classData) {
      setSubjects(classData.subjects);
      setSelectedSubject({ id: '', name: '' });
      setMaxMarks(0);
    } else {
      setSubjects([]);
      setSelectedSubject({ id: '', name: '' });
      setMaxMarks(0);
    }

    const filteredStudents = students.filter((student) => student.currentClass === selectedClass);
    setFilteredStudents(filteredStudents);
    setSelectedStudent('');
  };

  const handleSubjectChange = (event: SelectChangeEvent<string>) => {
    const selectedSubjectId = event.target.value;
    const selectedSubjectName = subjects.find((subject) => subject.id === selectedSubjectId)?.name || '';
    setSelectedSubject({ id: selectedSubjectId, name: selectedSubjectName });

    const exam = exams.find(
      (exam) => exam.class === selectedClass && exam.subject === selectedSubjectId
    );
    if (exam) {
      setMaxMarks(exam.maxMarks);
      setExamType(exam.type); 
    } else {
      setMaxMarks(0);
      setExamType('');
    }
  };

  const handleAddExamResult = () => {
    const resultRef = ref(database, 'results');
    const newResultRef = push(resultRef);
    set(newResultRef, {
      class: selectedClass,
      subject: selectedSubject.name, 
      student: selectedStudent,
      result: result,
      marks: marks,
      maxMarks: examType === 'Final' ? 100 : examType === 'Midterm' ? 50 : 0, 
      type: examType,
    });

    setSelectedClass('');
    setSelectedSubject({ id: '', name: '' });
    setSelectedStudent('');
    setResult('');
    setMarks(0);
    setMaxMarks(0);
    setExamType('');
  };

  return (
    <Container className="mt-4">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Exam Result
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
              value={selectedSubject.id}
              onChange={handleSubjectChange}
            >
              {subjects.map((subject, index) => (
                <MenuItem key={index} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {selectedClass && selectedSubject.id && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-student-label">Select Student</InputLabel>
            <Select
              labelId="select-student-label"
              id="select-student"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value as string)}
            >
              {filteredStudents.map((student, index) => (
                <MenuItem key={index} value={student.id}>
                  {student.firstName} {student.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {selectedClass && selectedSubject.id && selectedStudent && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-examtype-label">Exam Type</InputLabel>
            <Select
              labelId="select-examtype-label"
              id="select-examtype"
              value={examType}
              onChange={(e) => setExamType(e.target.value as string)}
            >
              {['Midterm', 'Final', 'Quiz', 'Assignment'].map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {selectedClass && selectedSubject.id && selectedStudent && examType && (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Max Marks"
              value={examType === 'Final' ? 100 : examType === 'Midterm' ? 50 : 0}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Marks Obtained"
              type="number"
              value={marks}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value <= (examType === 'Final' ? 100 : examType === 'Midterm' ? 50 : 0)) {
                  setMarks(value);
                }
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Result"
              value={result}
              onChange={(e) => setResult(e.target.value)}
            />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddExamResult}
              >
                Add Result
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default AddExamResult;
