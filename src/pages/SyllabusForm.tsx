import React, { useState } from 'react';
import { ref, set, push } from 'firebase/database';
import { database } from '../config/firebase';
import { Button as MuiButton, TextField } from '@mui/material';

interface SyllabusFormProps {
  syllabus?: Syllabus; 
  onClose: () => void;
  onSave: () => void;
}

interface Syllabus {
  id?: string; 
  classLevel: string;
  subjectName: string;
  syllabusDetails: string;
}

const SyllabusForm: React.FC<SyllabusFormProps> = ({ syllabus, onClose, onSave }) => {
  const [classLevel, setClassLevel] = useState<string>(syllabus?.classLevel || '');
  const [subjectName, setSubjectName] = useState<string>(syllabus?.subjectName || '');
  const [syllabusDetails, setSyllabusDetails] = useState<string>(syllabus?.syllabusDetails || '');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (syllabus?.id) {
        await set(ref(database, `syllabus/${syllabus.id}`), {
          classLevel,
          subjectName,
          syllabusDetails,
        });
        console.log('Syllabus updated successfully');
      } else {
        const newSyllabusRef = push(ref(database, 'syllabus'));
        await set(newSyllabusRef, {
          classLevel,
          subjectName,
          syllabusDetails,
        });
        console.log('New syllabus added successfully');
      }
      onSave(); 
    } catch (error) {
      console.error('Error saving syllabus:', error);
    }
  };

  return (
    <div className="syllabus-form">
      <h2>{syllabus ? 'Edit Syllabus' : 'Add Syllabus'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <TextField
            label="Class Level"
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </div>
        <div className="mb-3">
          <TextField
            label="Subject Name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </div>
        <div className="mb-3">
          <TextField
            label="Syllabus Details"
            value={syllabusDetails}
            onChange={(e) => setSyllabusDetails(e.target.value)}
            multiline
            rows={4}
            variant="outlined"
            fullWidth
          />
        </div>
        <div className="form-actions">
          <MuiButton variant="contained" color="primary" type="submit">
            {syllabus ? 'Update' : 'Save'}
          </MuiButton>
          <MuiButton variant="outlined" onClick={onClose}>
            Cancel
          </MuiButton>
        </div>
      </form>
    </div>
  );
};

export default SyllabusForm;
