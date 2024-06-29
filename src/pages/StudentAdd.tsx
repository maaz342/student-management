import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button as MuiButton } from '@mui/material';
import { ref, set, update } from 'firebase/database';
import { database } from '../config/firebase';
import TextFieldComponent from '../components/TextField';
import SelectComponent from '../components/Select';
import DateFieldComponent from '../components/DateField';
import { SelectChangeEvent } from '@mui/material/Select';

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

interface StudentFormProps {
  student?: Student;
  onSave: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student: editingStudent, onSave }) => {
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
  });

  useEffect(() => {
    if (editingStudent) {
      setStudent(editingStudent);
    }
  }, [editingStudent]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const studentRef = ref(database, 'students/' + student.email.replace('.', '_')); 
      if (editingStudent) {
        await update(studentRef, student);
      } else {
        await set(studentRef, student);
      }
      console.log('Student saved:', student);
      setStudent({
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
      });
      onSave();
    } catch (e) {
      console.error('Error saving student: ', e);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add/Edit Student</h2>
      <form>
        <div className="mb-3 row">
          <label htmlFor="firstName" className="col-sm-2 col-form-label">First Name</label>
          <div className="col-sm-10">
            <TextFieldComponent
              id="firstName"
              name="firstName"
              label="First Name"
              value={student.firstName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="lastName" className="col-sm-2 col-form-label">Last Name</label>
          <div className="col-sm-10">
            <TextFieldComponent
              id="lastName"
              name="lastName"
              label="Last Name"
              value={student.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="dateOfBirth" className="col-sm-2 col-form-label">Date of Birth</label>
          <div className="col-sm-10">
            <DateFieldComponent
              id="dateOfBirth"
              name="dateOfBirth"
              label="Date of Birth"
              value={student.dateOfBirth}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="gender" className="col-sm-2 col-form-label">Gender</label>
          <div className="col-sm-10">
            <SelectComponent
              id="gender"
              name="gender"
              label="Gender"
              value={student.gender}
              onChange={handleSelectChange}
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="address" className="col-sm-2 col-form-label">Address</label>
          <div className="col-sm-10">
            <TextFieldComponent
              id="address"
              name="address"
              label="Address"
              value={student.address}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="phone" className="col-sm-2 col-form-label">Phone</label>
          <div className="col-sm-10">
            <TextFieldComponent
              id="phone"
              name="phone"
              label="Phone"
              value={student.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <TextFieldComponent
              id="email"
              name="email"
              label="Email"
              value={student.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="currentClass" className="col-sm-2 col-form-label">Current Class</label>
          <div className="col-sm-10">
            <TextFieldComponent
              id="currentClass"
              name="currentClass"
              label="Current Class"
              value={student.currentClass}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="enrollmentDate" className="col-sm-2 col-form-label">Enrollment Date</label>
          <div className="col-sm-10">
            <DateFieldComponent
              id="enrollmentDate"
              name="enrollmentDate"
              label="Enrollment Date"
              value={student.enrollmentDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="promotionDate" className="col-sm-2 col-form-label">Promotion Date</label>
          <div className="col-sm-10">
            <DateFieldComponent
              id="promotionDate"
              name="promotionDate"
              label="Promotion Date"
              value={student.promotionDate || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <div className="col-sm-10 offset-sm-2">
            <MuiButton
              variant="contained"
              color="primary"
              onClick={handleSave}
              className="me-2"
            >
              Save
            </MuiButton>
            <MuiButton
              variant="contained"
              color="secondary"
              onClick={() =>
                setStudent({
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
                })
              }
              className="me-2"
            >
              Cancel
            </MuiButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
