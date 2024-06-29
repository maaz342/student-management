import React, { useState, useEffect } from 'react';
import { Button as MuiButton, SelectChangeEvent } from '@mui/material';
import { ref, get, child } from 'firebase/database';
import { database } from '../config/firebase'; 
import StudentForm from './StudentAdd';
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

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [filterClass, setFilterClass] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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
          studentsData.push(student);
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

  const filteredStudents = filterClass
    ? students.filter(student => student.currentClass === filterClass)
    : students;

  return (
    <div className="container mt-4">
      <h2>Student List</h2>
      <SelectComponent
        id="filter-class"
        name="filterClass"
        label="Filter by Class"
        value={filterClass}
        onChange={handleFilterClassChange}
        options={[{ value: '', label: 'All Classes' }, ...classes.map(className => ({ value: className, label: className }))]}
      />
      <div className="mt-4">
        {filteredStudents.map((student, index) => (
          <div key={index} className="student-card mb-2 p-2 border rounded">
            <h5>{student.firstName} {student.lastName}</h5>
            <p>Class: {student.currentClass}</p>
            <p>Date of Birth: {student.dateOfBirth}</p>
            <p>Email: {student.email}</p>
            <MuiButton
              variant="contained"
              color="primary"
              onClick={() => setSelectedStudent(student)}
            >
              Edit
            </MuiButton>
          </div>
        ))}
      </div>
      {selectedStudent && (
        <StudentForm
          student={selectedStudent}
          onSave={() => {
            setSelectedStudent(null);
            fetchStudents();
          }}
        />
      )}
    </div>
  );
};

export default StudentList;
