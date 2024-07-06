import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Grid, Box } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

interface ClassHistory {
  className: string;
  fromDate: string;
  toDate: string;
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
  password: string;
}

const AdmissionForm: React.FC = () => {
  const [student, setStudent] = useState<Student>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    currentClass: '',
    enrollmentDate: '',
    promotionDate: '',
    classHistory: [],
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  const addStudent = async (student: Student) => {
    const db = getDatabase();
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, student.email, student.password);
      const userId = userCredential.user.uid;

      await set(ref(db, `students/${userId}`), {
        ...student,
        uid: userId,
      });
    } catch (error) {
      throw new Error('Failed to add student');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addStudent(student);
      setError(null);
    } catch (error) {
      setError('An error occurred while adding the student.');
    }
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" className="text-center mb-4">
          Admission Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={student.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={student.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={student.dateOfBirth}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Gender"
                name="gender"
                value={student.gender}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={student.address}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone"
                name="phone"
                value={student.phone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={student.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Current Class"
                name="currentClass"
                value={student.currentClass}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Enrollment Date"
                name="enrollmentDate"
                type="date"
                value={student.enrollmentDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={student.password}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} className="text-center mt-3">
              <Button variant="contained" color="primary" type="submit">
                Add Student
              </Button>
              {error && <Typography color="error" variant="body2" className="mt-2">{error}</Typography>}
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default AdmissionForm;
