import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button as MuiButton, SelectChangeEvent } from '@mui/material';
import { ref, get, child } from 'firebase/database';
import { database } from '../config/firebase'; 
import SelectComponent from '../components/Select';
import TeacherAdd from './TeacherAdd';
import { useNavigate } from 'react-router-dom'; 

interface Teacher {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  Class: string;
  email: string;
  password: string;
  qualification: string;
  pastexperience: string;
  subjectSpeciality: string;
  classLevel: string;
}

const TeacherList: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [filterClass, setFilterClass] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, 'teachers'));
      if (snapshot.exists()) {
        const teachersData: Teacher[] = [];
        const classSet: Set<string> = new Set();

        snapshot.forEach(childSnapshot => {
          const teacher: Teacher = childSnapshot.val();
          teachersData.push(teacher);
          classSet.add(teacher.Class);
        });

        setTeachers(teachersData);
        setClasses(Array.from(classSet));
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleFilterClassChange = (event: SelectChangeEvent<string>) => {
    setFilterClass(event.target.value as string);
  };

  const filteredTeachers = filterClass
    ? teachers.filter(teacher => teacher.Class === filterClass)
    : teachers;

  return (
    <div className="container mt-4">
      <h2>Teacher List</h2>
      <SelectComponent
        id="filter-class"
        name="filterClass"
        label="Filter by Class"
        value={filterClass}
        onChange={handleFilterClassChange}
        options={[{ value: '', label: 'All Classes' }, ...classes.map(className => ({ value: className, label: className }))]}
      />
      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeachers.map((teacher, index) => (
              <TableRow key={index}>
                <TableCell>{teacher.firstName}</TableCell>
                <TableCell>{teacher.lastName}</TableCell>
                <TableCell>{teacher.Class}</TableCell>
                <TableCell>{teacher.dateOfBirth}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>
                  
              
                  <MuiButton variant="contained" color="secondary" onClick={() => navigate(`/dashboard/allocate-class/${teacher.email}`)}
className="me-2">
          Allocate Class
        </MuiButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedTeacher && (
        <TeacherAdd
          teacher={selectedTeacher}
          onSave={() => {
            setSelectedTeacher(null);
            fetchTeachers();
          }}
        />
      )}
    </div>
  );
};

export default TeacherList;