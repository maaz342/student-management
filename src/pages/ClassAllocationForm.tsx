import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, update, get } from 'firebase/database';
import { database } from '../config/firebase';
import { TextField, Button as MuiButton, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

const ClassAllocationForm: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const [teacher, setTeacher] = useState<any>(null);
  const [newClass, setNewClass] = useState<number | ''>('');
  const [newSubject, setNewSubject] = useState<string>('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      fetchTeacher(email.replace('_', '.'));
    }
  }, [email]);

  useEffect(() => {
    if (newClass !== '') {
      fetchSubjects(newClass);
    } else {
      setSubjects([]);
    }
  }, [newClass]);

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

  const fetchSubjects = async (selectedClass: number) => {
    const dbRef = ref(database, 'subjects');
  
    try {
      const snapshot = await get(dbRef);
  
      if (snapshot.exists()) {
        const subjectsList: string[] = [];
  
        snapshot.forEach((childSnapshot) => {
          const subject = childSnapshot.val();
          const subjectClassLevel = parseInt(subject.classLevel, 10);
  
          if (subjectClassLevel === selectedClass) {
            subjectsList.push(subject.subjectName);
          }
        });
  
        setSubjects(subjectsList);
      } else {
        console.log('No subjects available in database');
        setSubjects([]);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    }
  };

  const handleClassChange = (event: SelectChangeEvent<string>) => {
    const selectedClass = event.target.value;
    setNewClass(selectedClass === '' ? '' : parseInt(selectedClass, 10)); // Ensure selectedClass is parsed correctly
    setNewSubject(''); 
  };

  const handleSubjectChange = (event: SelectChangeEvent<string>) => {
    setNewSubject(event.target.value);
  };

  const handleSave = async () => {
    if (teacher) {
      const updatedTeacher = {
        ...teacher,
        Class: newClass.toString(), 
        subjectSpeciality: newSubject,
      };

      const teacherRef = ref(database, `teachers/${teacher.email.replace('.', '_')}`);
  
      try {
        await update(teacherRef, updatedTeacher);
        console.log('Teacher updated successfully');
        navigate('/teacher-list');
      } catch (error) {
        console.error('Error updating teacher:', error);
      }
    }
  };

  if (!teacher) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Allocate Class and Subject</h2>
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
              value={teacher.subjectSpeciality}
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
                value={newClass === '' ? '' : newClass.toString()}
                onChange={handleClassChange}
              >
                <MenuItem value="">Select Class</MenuItem>
                <MenuItem value="1">Class 1</MenuItem>
                <MenuItem value="2">Class 2</MenuItem>
                <MenuItem value="3">Class 3</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="newSubject" className="col-sm-2 col-form-label">New Subject</label>
          <div className="col-sm-10">
            <FormControl fullWidth margin="normal">
              <InputLabel id="newSubject-label">New Subject</InputLabel>
              <Select
                labelId="newSubject-label"
                id="newSubject"
                name="newSubject"
                value={newSubject}
                onChange={handleSubjectChange}
              >
                {subjects.length === 0 ? (
                  <MenuItem disabled value="">
                    No subjects available for this class level
                  </MenuItem>
                ) : (
                  subjects.map((subject, index) => (
                    <MenuItem key={index} value={subject}>{subject}</MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </div>
        </div>
        <MuiButton variant="contained" color="primary" onClick={handleSave} className="me-2">
          Save
        </MuiButton>
        <MuiButton variant="contained" color="secondary" onClick={() => navigate('/teacher-list')}>
          Cancel
        </MuiButton>
      </form>
    </div>
  );
};

export default ClassAllocationForm;
