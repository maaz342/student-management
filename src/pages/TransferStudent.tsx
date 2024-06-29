import React, { useState, useEffect } from 'react';
import { Select, MenuItem, InputLabel, FormControl, Button as MuiButton, SelectChangeEvent, TextField } from '@mui/material';
import { ref, get, child, update } from 'firebase/database';
import { database } from '../config/firebase'; 
import SelectComponent from '../components/Select'; 

interface ClassHistory {
  className: string;
  startDate: string;
  endDate: string;
}

interface Student {
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

const TransferStudent: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<string[]>([]);
    const [filterClass, setFilterClass] = useState<string>('');
    const [selectedStudentEmail, setSelectedStudentEmail] = useState<string>('');
    const [newClass, setNewClass] = useState<string>('');
  
    useEffect(() => {
      fetchStudents();
    }, []);
  
    const fetchStudents = async () => {
      const dbRef = ref(database);
      try {
        const snapshot = await get(child(dbRef, 'students'));
        if (snapshot.exists()) {
          const studentsData: Student[] = [];
          const classSet: Set<string> = new Set();
  
          snapshot.forEach(childSnapshot => {
            const student: Student = childSnapshot.val();
            studentsData.push({
              ...student,
              classHistory: student.classHistory ?? []
            });
            classSet.add(student.currentClass);
          });
  
          setStudents(studentsData);
          setClasses(Array.from(classSet));
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
  
    const handleFilterClassChange = (event: SelectChangeEvent<string>) => {
      setFilterClass(event.target.value as string);
    };
  
    const handleStudentChange = (event: SelectChangeEvent<string>) => {
      setSelectedStudentEmail(event.target.value as string);
    };
  
    const handleNewClassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewClass(event.target.value);
    };
  
    const handleTransfer = async () => {
      try {
        const selectedStudent = students.find(student => student.email === selectedStudentEmail);
        if (selectedStudent) {
          const newClassHistory = [
            ...selectedStudent.classHistory,
            {
              className: selectedStudent.currentClass,
              startDate: selectedStudent.enrollmentDate,
              endDate: new Date().toISOString().split('T')[0],
            },
          ];
  
          const updatedStudent = {
            ...selectedStudent,
            currentClass: newClass,
            enrollmentDate: new Date().toISOString().split('T')[0],
            classHistory: newClassHistory,
          };
  
          const studentRef = ref(database, 'students/' + selectedStudentEmail.replace('.', '_'));
          await update(studentRef, updatedStudent);
  
          console.log('Student transferred:', updatedStudent);
  
          // Clear selection
          setSelectedStudentEmail('');
          setNewClass('');
          fetchStudents(); 
        }
      } catch (e) {
        console.error('Error transferring student: ', e);
      }
    };
  
    const filteredStudents = filterClass
      ? students.filter(student => student.currentClass === filterClass)
      : students;
  return (
    <div className="container mt-4">
      <h2>Transfer Student</h2>
      <SelectComponent
        id="filter-class"
        name="filterClass"
        label="Filter by Class"
        value={filterClass}
        onChange={handleFilterClassChange}
        options={[{ value: '', label: 'All Classes' }, ...classes.map(className => ({ value: className, label: className }))]}
      />
      <SelectComponent
        id="select-student"
        name="selectedStudent"
        label="Select Student"
        value={selectedStudentEmail}
        onChange={handleStudentChange}
        options={filteredStudents.map(student => ({ value: student.email, label: `${student.firstName} ${student.lastName}` }))}
      />
      <TextField
        id="new-class"
        label="New Class"
        value={newClass}
        onChange={handleNewClassChange}
        fullWidth
        margin="normal"
      />
      <MuiButton
        variant="contained"
        color="primary"
        onClick={handleTransfer}
        disabled={!selectedStudentEmail || !newClass}
      >
        Transfer
      </MuiButton>
    </div>
  );
};

export default TransferStudent;
