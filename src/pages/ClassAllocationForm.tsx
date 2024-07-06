import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, update, get } from 'firebase/database';
import { database } from '../config/firebase';
import { TextField, Button as MuiButton, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

const ClassAllocationForm: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const [teacher, setTeacher] = useState<any>(null);
  const [newClass, setNewClass] = useState<string>(''); // Use string type for class name
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      fetchTeacher(email.replace('_', '.'));
    }
  }, [email]);

  useEffect(() => {
    if (teacher) {
      setCurrentSubject(teacher.subjectSpeciality || '');
      setNewClass(teacher.Class || '');
    }
  }, [teacher]);

  const fetchTeacher = async (teacherEmail: string) => {
    const teacherPath = `teachers/${teacherEmail.replace('.', '_')}`;
    const teacherRef = ref(database, teacherPath);
  
    try {
      const snapshot = await get(teacherRef);
  
      if (snapshot.exists()) {
        setTeacher(snapshot.val());
      } else {
        console.log('Teacher data not found');
      }
    } catch (error) {
      console.error('Error fetching teacher:', error);
    }
  };

  const handleClassChange = (event: SelectChangeEvent<string>) => {
    const selectedClass = event.target.value;
    setNewClass(selectedClass);
  };

  const handleSave = async () => {
    if (teacher && newClass !== '') {
      const updatedTeacher = {
        ...teacher,
        Class: newClass, 
      };

      const teacherRef = ref(database, `teachers/${teacher.email.replace('.', '_')}`);
  
      try {
        await update(teacherRef, updatedTeacher);
        console.log('Teacher updated successfully');
        navigate('/dashboard/teacher-list'); // Navigate to the teacher list
      } catch (error) {
        console.error('Error updating teacher:', error);
      }
    }
  };

  if (!teacher) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Allocate Class</h2>
      <form>
        <div className="mb-3 row">
          <label htmlFor="firstName" className="col-sm-2 col-form-label">First Name</label>
          <div className="col-sm-10">
            <TextField
              id="firstName"
              name="firstName"
              value={teacher.firstName}
              disabled
              fullWidth
              margin="normal"
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="lastName" className="col-sm-2 col-form-label">Last Name</label>
          <div className="col-sm-10">
            <TextField
              id="lastName"
              name="lastName"
              value={teacher.lastName}
              disabled
              fullWidth
              margin="normal"
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="currentClass" className="col-sm-2 col-form-label">Current Class</label>
          <div className="col-sm-10">
            <TextField
              id="currentClass"
              name="currentClass"
              value={teacher.Class}
              disabled
              fullWidth
              margin="normal"
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="currentSubject" className="col-sm-2 col-form-label">Current Subject</label>
          <div className="col-sm-10">
            <TextField
              id="currentSubject"
              name="currentSubject"
              value={currentSubject}
              disabled
              fullWidth
              margin="normal"
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="newClass" className="col-sm-2 col-form-label">New Class</label>
          <div className="col-sm-10">
            <FormControl fullWidth margin="normal">
              <InputLabel id="newClass-label">New Class</InputLabel>
              <Select
                labelId="newClass-label"
                id="newClass"
                name="newClass"
                value={newClass}
                onChange={handleClassChange}
              >
                <MenuItem value="">Select Class</MenuItem>
                <MenuItem value="Class 1">Class 1</MenuItem>
                <MenuItem value="Class 2">Class 2</MenuItem>
                <MenuItem value="Class 3">Class 3</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <MuiButton variant="contained" color="primary" onClick={handleSave} className="me-2">
          Save
        </MuiButton>
        <MuiButton variant="contained" color="secondary" onClick={() => navigate('/dashboard/list-teacher')}>
          Cancel
        </MuiButton>
      </form>
    </div>
  );
};

export default ClassAllocationForm;
