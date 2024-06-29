import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button as MuiButton } from '@mui/material';
import { ref, set, update } from 'firebase/database';
import { database } from '../config/firebase'; 
import TextFieldComponent from '../components/TextField';
import SelectComponent from '../components/Select';
import DateFieldComponent from '../components/DateField';
import { SelectChangeEvent } from '@mui/material/Select';

interface Teacher {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  qualification: string;
  pastexperience: string;
  subjectSpeciality: string;
  classLevel: string;
}

interface TeacherFormProps {
  teacher?: Teacher;
  onSave: () => void;
}

const TeacherAdd: React.FC<TeacherFormProps> = ({ teacher: editingTeacher, onSave }) => {
  const [teacher, setTeacher] = useState<Teacher>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    qualification: '',
    pastexperience: '',
    subjectSpeciality: '',
    classLevel: '',
  });

  useEffect(() => {
    if (editingTeacher) {
      setTeacher(editingTeacher);
    }
  }, [editingTeacher]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const teacherRef = ref(database, 'teachers/' + teacher.email.replace('.', '_'));
      if (editingTeacher) {
        await update(teacherRef, teacher);
      } else {
        await set(teacherRef, teacher);
      }
      console.log('Teacher saved:', teacher);
      setTeacher({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
        password: '',
        qualification: '',
        pastexperience: '',
        subjectSpeciality: '',
        classLevel: '',
      });
      onSave();
    } catch (e) {
      console.error('Error saving teacher: ', e);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className='text-center'>Add Teacher</h2>
      <form>
        <div className="mb-3 row">
          <label htmlFor="firstName" className="col-sm-2 col-form-label">First Name</label>
          <div className="col-sm-10">
            <TextFieldComponent
              id="firstName"
              name="firstName"
              label="First Name"
              value={teacher.firstName}
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
              value={teacher.lastName}
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
              value={teacher.dateOfBirth}
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
              value={teacher.gender}
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
              value={teacher.address}
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
              value={teacher.phone}
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
              value={teacher.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <TextFieldComponent
              id="password"
              name="password"
              label="Password"
           value={teacher.password}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="qualification" className="col-sm-2 col-form-label">Qualification</label>
          <div className="col-sm-10">
            <TextFieldComponent
              id="qualification"
              name="qualification"
              label="Qualification"
              value={teacher.qualification}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="pastexperience" className="col-sm-2 col-form-label">Past Experience</label>
          <div className="col-sm-10">
            <TextFieldComponent
              id="pastexperience"
              name="pastexperience"
              label="Past Experience"
              value={teacher.pastexperience}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="subjectSpeciality" className="col-sm-2 col-form-label">Subject Speciality</label>
          <div className="col-sm-10">
            <TextFieldComponent
              id="subjectSpeciality"
              name="subjectSpeciality"
              label="Subject Speciality"
              value={teacher.subjectSpeciality}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="classLevel" className="col-sm-2 col-form-label">Class Level</label>
          <div className="col-sm-10">
            <SelectComponent
              id="classLevel"
              name="classLevel"
              label="Class Level"
              value={teacher.classLevel}
              onChange={handleSelectChange}
              options={[
                { value: '', label: 'Select Class Level' },
                { value: 'Class 1', label: 'Class 1' },
                { value: 'Class 2', label: 'Class 2' },
                { value: 'Class 3', label: 'Class 3' },
                { value: 'Class 4', label: 'Class 4' },
                { value: 'Class 5', label: 'Class 5' },
                { value: 'Class 6', label: 'Class 6' },
                { value: 'Class 7', label: 'Class 7' },
                { value: 'Class 8', label: 'Class 8' },
                { value: 'Class 9', label: 'Class 9' },
                { value: 'Class 10', label: 'Class 10' },
                { value: 'Class 11', label: 'Class 11' },
                { value: 'Class 12', label: 'Class 12' }
              ]}
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
                setTeacher({
                  firstName: '',
                  lastName: '',
                  dateOfBirth: '',
                  gender: '',
                  address: '',
                  phone: '',
                  email: '',
                  password: '',
                  qualification: '',
                  pastexperience: '',
                  subjectSpeciality: '',
                  classLevel: '',
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

export default TeacherAdd;
